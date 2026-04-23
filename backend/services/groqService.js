const Groq = require("groq-sdk");

// ─── Groq Client ──────────────────────────────────────────────────────────────
// GROQ_API_KEY is loaded from the .env file
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama3-8b-8192"; // Default model — can be swapped here centrally

// ─── getCodeReview ────────────────────────────────────────────────────────────
// Sends the user's code to Groq and returns AI-generated suggestions as a string
// Called by: reviewController.js → submitReview()

const getCodeReview = async (code, language = "plaintext") => {
  const prompt = `You are an expert code reviewer. Review the following ${language} code and provide clear, actionable suggestions on:
- Code quality and readability
- Potential bugs or logical errors
- Best practices and improvements
- Performance considerations (if applicable)

Keep your feedback concise and developer-friendly.

\`\`\`${language}
${code}
\`\`\``;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract the text content from Groq's response structure
  return response.choices[0]?.message?.content || "No suggestions returned.";
};

module.exports = { getCodeReview };
