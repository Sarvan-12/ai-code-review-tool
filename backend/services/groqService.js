const Groq = require("groq-sdk");

// ─── Groq Client ──────────────────────────────────────────────────────────────
// GROQ_API_KEY is loaded from the .env file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile"; // Default model — can be swapped here centrally

/**
 * Sends a code snippet to the Groq AI API for review.
 * Returns a structured JSON object containing a score, bugs, issues, and refactored code.
 * 
 * @param {string} code - The source code to be reviewed.
 * @param {string} [language="plaintext"] - The programming language of the code.
 * @returns {Promise<Object>} A promise that resolves to the structured AI review object.
 */
const getCodeReview = async (code, language = "plaintext") => {
  const prompt = `You are an expert code reviewer. Review the following ${language} code.
Respond strictly in JSON format exactly like this structure:
{
  "score": 0, // A score from 0-10 rating the overall code quality
  "bugs": [ // empty array [] if none. Array of objects with "issue" and "fix" keys
    { "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "issues": [ // empty array [] if none. General quality or readability issues
    { "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "improvements": [ // empty array [] if none. Best practices not followed
    { "issue": "Best practice not followed", "fix": "Suggested best practice" }
  ],
  "performance": [ // empty array [] if none. Performance bottlenecks
    { "issue": "Performance bottleneck", "fix": "Optimization suggestion" }
  ],
  "refactored_code": "String containing the fully refactored and improved code, or empty string if no refactor is needed."
}

CRITICAL RULES:
1. ONLY include meaningful issues. Do not suggest unnecessary improvements for simple code.
2. Avoid generic advice. Be specific to the provided code.
3. If the code is already correct, return empty arrays and say "No major issues found" in the refactored_code section if no refactor is needed.
4. Every object inside the arrays MUST include BOTH the "issue" property and the "fix" property as strings. Do not omit the "fix" key.
5. If there are no items for a category, return an empty array []. Do not use strings like "None".
6. Ensure code inside "refactored_code" uses proper indentation (2 or 4 spaces) and newlines for readability. Do NOT return the code as a single line. Use real newlines characters.
7. CRITICAL: The "refactored_code" field must contain ONLY the raw source code. Do NOT include any introductory text, conversational remarks, or markdown code fences (like \`\`\`) inside this specific JSON string value. Any explanations should be in the issues/improvements arrays instead.

\`\`\`${language}
${code}
\`\`\``;

  let content = "{}";

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Ensures Groq strictly outputs JSON
    });

    content = response.choices[0]?.message?.content || "{}";
  } catch (apiError) {
    console.error("Groq API validation failed:", apiError.message);

    // Extract failed_generation from the API message if the SDK embeds it as a string
    let failedGen =
      apiError?.error?.failed_generation || apiError?.failed_generation;
    if (!failedGen && apiError.message) {
      try {
        const match = apiError.message.match(/\{"error":.*\}/);
        if (match) {
          const parsedErr = JSON.parse(match[0]);
          failedGen = parsedErr.error?.failed_generation;
        }
      } catch (e) {
        // Ignore extraction errors
      }
    }

    if (failedGen) {
      content = failedGen;
    } else {
      return {
        score: 0,
        issues: [
          {
            issue: "Groq API Error",
            fix: "The AI failed to generate a valid response. Try submitting the code again.",
          },
        ],
        improvements: [],
        performance: [],
        refactored_code: "",
      };
    }
  }

  // Strip markdown fences (`` `json ... `` `) if Groq returns them
  const raw = content.replace(/```json|```/g, "").trim();

  // Try to parse the JSON securely
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse Groq JSON response:", error.message);
    // Fallback object to prevent API crash. Include the raw failed JSON in refactored_code so the user can still read the AI's suggestions!
    return {
      score: 0,
      issues: [
        {
          issue: "Failed to parse API output",
          fix: "The AI's JSON output was structurally invalid. Raw output is provided below.",
        },
      ],
      improvements: [],
      performance: [],
      refactored_code: raw,
    };
  }
};

module.exports = { getCodeReview };
