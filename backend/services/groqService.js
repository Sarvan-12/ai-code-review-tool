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
<<<<<<< Updated upstream
  const prompt = `
You are an expert code reviewer. Review the following ${language} code.

Respond strictly in JSON format exactly like this structure:
{
  "score": 0,
  "bugs": [
    { "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "issues": [
    { "issue": "Description of the problem", "fix": "How to fix it" }
  ],
  "improvements": [
    { "issue": "Best practice not followed", "fix": "Suggested best practice" }
  ],
  "performance": [
    { "issue": "Performance bottleneck", "fix": "Optimization suggestion" }
  ],
  "refactored_code": "String containing the fully refactored and improved code, or empty string if no refactor is needed."
}

CRITICAL RULES:
1. ONLY include meaningful issues. Do not suggest unnecessary improvements for simple code.
2. Avoid generic advice. Be specific to the provided code.
3. If the code is already correct, return empty arrays and say "No major issues found" in the refactored_code section if no refactor is needed.
4. Every object inside the arrays MUST include BOTH the "issue" property and the "fix" property as strings.
5. If there are no items for a category, return an empty array [].
6. Ensure code inside "refactored_code" escapes newlines and quotes correctly.

\`\`\`${language}
${code}
\`\`\`
`;
=======

  // 🧪 TEST MODE SWITCHES (ADD THESE)
  if (process.env.TEST_TIMEOUT === "true") {
    await new Promise(resolve => setTimeout(resolve, 35000)); // 35s delay
  }

  if (process.env.TEST_SERVER_ERROR === "true") {
    throw new Error("Simulated server crash");
  }

  const prompt = `You are an expert code reviewer...`;
>>>>>>> Stashed changes

  let content = "{}";

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    content = response.choices[0]?.message?.content || "{}";

  } catch (apiError) {
    console.error("Groq API validation failed:", apiError.message);

<<<<<<< Updated upstream
    // Extract failed_generation from the API message if available
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
=======
    // ⚠️ IMPORTANT: preserve error type
    if (apiError.code === "ETIMEDOUT") {
      throw new Error("TIMEOUT");
>>>>>>> Stashed changes
    }

    throw new Error("API_ERROR");
  }

<<<<<<< Updated upstream
  // Strip markdown fences (```json ... ```)
=======
>>>>>>> Stashed changes
  const raw = content.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(raw);
  } catch (error) {
<<<<<<< Updated upstream
    console.error("Failed to parse Groq JSON response:", error.message);

=======
>>>>>>> Stashed changes
    return {
      score: 0,
      issues: [
        {
          issue: "Invalid JSON from AI",
          fix: "Retry the request",
        },
      ],
      improvements: [],
      performance: [],
      refactored_code: raw,
    };
  }
};

module.exports = { getCodeReview };