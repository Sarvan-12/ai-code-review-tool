const Groq = require("groq-sdk");

const MODEL = "llama-3.3-70b-versatile"; // Default model — can be swapped here centrally

/**
 * Helper to retrieve all configured Groq API keys from the environment.
 * Supports a comma-separated list GROQ_API_KEYS or a single GROQ_API_KEY.
 * 
 * @returns {string[]} An array of Groq API keys.
 */
const getApiKeys = () => {
  const keys = [];
  if (process.env.GROQ_API_KEYS) {
    keys.push(...process.env.GROQ_API_KEYS.split(",").map(k => k.trim()).filter(Boolean));
  }
  if (process.env.GROQ_API_KEY && !keys.includes(process.env.GROQ_API_KEY)) {
    keys.push(process.env.GROQ_API_KEY);
  }
  return keys;
};

/**
 * Helper to prepend line numbers to code to allow line-specific feedback.
 * 
 * @param {string} code - The original source code.
 * @returns {string} The code with line numbers prepended.
 */
const addLineNumbers = (code) => {
  if (!code) return "";
  return code
    .split("\n")
    .map((line, index) => `${index + 1}: ${line}`)
    .join("\n");
};

/**
 * Sends a code snippet to the Groq AI API for review.
 * Returns a structured JSON object containing a score, bugs, issues, and refactored code.
 * Supports automatic key rotation failover if rate limits are hit.
 * 
 * @param {string} code - The source code to be reviewed.
 * @param {string} [language="plaintext"] - The programming language of the code.
 * @returns {Promise<Object>} A promise that resolves to the structured AI review object.
 */
const getCodeReview = async (code, language = "plaintext") => {
  const numberedCode = addLineNumbers(code);
  const prompt = `You are an expert code reviewer. Review the following ${language} code.
Respond strictly in JSON format exactly like this structure:
{
  "score": 0, // A score from 0-100 rating the overall code quality. Be granular and precise (e.g., 73, 86, 91).
  "bugs": [ // empty array [] if none. Array of objects
    { "line": 12, "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "issues": [ // empty array [] if none. Logical flaws, semantic bugs, or potential security/edge-case concerns.
    { "line": 24, "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "improvements": [ // empty array [] if none. General code quality, readability, naming conventions, and best practices.
    { "line": null, "issue": "Best practice not followed", "fix": "Suggested best practice" }
  ],
  "performance": [ // empty array [] if none. Performance bottlenecks
    { "line": 8, "issue": "Performance bottleneck", "fix": "Optimization suggestion" }
  ],
  "complexity": {
    "original": "O(n²)", // Time complexity of original code, or null if not applicable/non-algorithmic (e.g. HTML/CSS)
    "optimized": "O(n log n)", // Time complexity of refactored code, or null if not applicable
    "explanation": "Why the complexity improved." // A brief explanation of the change, or null if not applicable
  },
  "refactored_code": "String containing the fully refactored and improved code, or empty string if no refactor is needed."
}

Return ONLY valid JSON. No markdown, no explanatory text before or after. Start directly with the opening brace {.

CRITICAL RULES:
1. ONLY include meaningful issues. Do not suggest unnecessary improvements for simple code.
2. Avoid generic advice. Be specific to the provided code.
3. If the code is already correct and requires no improvements or fixes, return empty arrays for bugs, issues, improvements, and performance.
4. Every object inside bugs, issues, improvements, and performance arrays MUST have exactly three properties: "line" (integer representing the 1-based line number of the code where the issue occurs, or null if it applies to the whole file), "issue" (string describing the problem), and "fix" (string describing the solution). Do not add any other fields.
5. If there are no items for a category, return an empty array []. Do not use strings like "None".
5b. If any bugs, issues, improvements, or performance problems are detected (any of their arrays are not empty), you MUST generate the fully refactored code in the "refactored_code" field. You are ONLY allowed to set "refactored_code" to "No refactoring needed" if there are absolutely zero bugs, issues, improvements, or performance problems detected (all arrays are completely empty).
6. Ensure code inside "refactored_code" uses proper indentation (2 or 4 spaces) and newlines for readability. Do NOT return the code as a single line. Use real newlines characters.
7. CRITICAL: The "refactored_code" field must contain ONLY the raw source code. Do NOT include any introductory text, conversational remarks, or markdown code fences (like \`\`\`) inside this specific JSON string value. Any explanations should be in the issues/improvements arrays instead.
8. CRITICAL: Categorize issues strictly. General coding style, readability, comments, and variable/class naming conventions MUST go in the "improvements" array (Best Practices). Do NOT put them in the "issues" array, which is reserved strictly for logic flaws, semantic bugs, and security vulnerabilities.
9. CRITICAL: All descriptions must be clear, concise, and grammatically perfect. Use simple, direct language. Avoid awkward or unnatural phrasing like "The function uses a true O(n²) of duplicates" or "No security & logic selected". Example of RIGHT phrasing: "This function has O(n²) time complexity because of nested loops, making it slow for large inputs."
10. CRITICAL: Every suggestion across all categories must be completely unique. Do not repeat the same issue or fix (or minor variations of it) within the same category or across different categories.
11. CRITICAL: Use simple, direct sentence structures. Avoid complex nested clauses. Example: "Variable names should be descriptive" not "Variable name could be used to describe what it does not follow..."
12. CRITICAL: The code provided to you below has line numbers prepended (e.g., "1: public class Solution {"). You MUST reference these exact line numbers in the "line" property of your suggestions.
13. CRITICAL: The "refactored_code" field MUST NOT contain any line numbers. It must be clean, compile-ready code without the line number prefixes.
14. CRITICAL: Analyze the time complexity of the input code and the refactored code. Provide these in the "complexity" object. If complexity analysis is not applicable to the submitted code (e.g. for HTML, CSS, assets, or simple configuration files), set all properties of the "complexity" object to null.

Here is the code with line numbers prepended:
\`\`\`${language}
${numberedCode}
\`\`\``;

  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("No Groq API keys configured in the .env file.");
  }

  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const groq = new Groq({ apiKey: key });

    try {
      const response = await groq.chat.completions.create(
        {
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_tokens: 2048,
          temperature: 0,
        },
        { timeout: 30000 }
      );

      const content = response.choices[0]?.message?.content || "{}";
      const raw = content.replace(/```json|```/g, "").trim();
      return JSON.parse(raw);

    } catch (apiError) {
      console.error(`Groq API key at index ${i} failed:`, apiError.message);
      lastError = apiError;

      // Rate limit or Auth issue triggers failover
      if (apiError.status === 429 || apiError.status === 401 || apiError.status === 403) {
        console.warn(`Key at index ${i} is unavailable. Trying next key in the pool...`);
        continue;
      }

      // Timeouts can also be retried if there are more keys
      if (
        apiError.name === "APITimeoutError" ||
        apiError.code === "ETIMEDOUT" ||
        (apiError.message && apiError.message.toLowerCase().includes("timeout"))
      ) {
        if (i < keys.length - 1) {
          console.warn(`Key at index ${i} timed out. Trying next key...`);
          continue;
        }
      }

      // For any other unexpected errors, try the next key if one is available
      if (i < keys.length - 1) {
        console.warn(`Unexpected error with key at index ${i}. Retrying with next key...`);
        continue;
      }
    }
  }

  // If all keys failed, format and throw the appropriate error
  if (lastError.status === 429) {
    const err = new Error("API Rate limit reached on all keys. Please wait a few seconds before trying again.");
    err.status = 429;
    err.type = 'rate_limit';
    throw err;
  }

  if (
    lastError.name === "APITimeoutError" ||
    lastError.code === "ETIMEDOUT" ||
    (lastError.message && lastError.message.toLowerCase().includes("timeout"))
  ) {
    const err = new Error("The AI is taking too long to respond. Please try again.");
    err.status = 504;
    err.type = 'timeout';
    throw err;
  }

  // Handle fallback content generation from API errors if embedded
  let failedGen =
    lastError?.error?.failed_generation || lastError?.failed_generation;
  if (!failedGen && lastError.message) {
    try {
      const match = lastError.message.match(/\{"error":.*\}/);
      if (match) {
        const parsedErr = JSON.parse(match[0]);
        failedGen = parsedErr.error?.failed_generation;
      }
    } catch (e) {
      // Ignore extraction errors
    }
  }

  if (failedGen) {
    try {
      const raw = failedGen.replace(/```json|```/g, "").trim();
      return JSON.parse(raw);
    } catch (e) {
      // Fall through to generic error
    }
  }

  const err = new Error("The AI failed to generate a valid response. Try submitting the code again.");
  err.status = 502;
  err.type = 'server';
  throw err;
};

module.exports = { getCodeReview };
