const Review = require("../models/Review");
const { getCodeReview } = require("../services/groqService");

// ─── POST /api/review ─────────────────────────────────────────────────────────
// Receives code + language, sends to Groq, saves result, returns structured JSON
const submitReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Basic input validation
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code is required" });
    }

    // Call Groq API via the service layer
    const suggestions = await getCodeReview(code, language);

    // Save the review result to MongoDB
    const review = await Review.create({
      code,
      language: language || "plaintext",
      suggestions,
    });

    // Return structured response to frontend
    return res.status(201).json({
      id: review._id,
      language: review.language,
      suggestions: review.suggestions,
      createdAt: review.createdAt,
    });
  } catch (error) {
    console.error("submitReview error:", error.message);
    return res.status(500).json({ error: "Failed to process review" });
  }
};

// ─── GET /api/review/:id ──────────────────────────────────────────────────────
// Fetches a single saved review document by its MongoDB ObjectId
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("getReviewById error:", error.message);
    return res.status(500).json({ error: "Failed to fetch review" });
  }
};

// ─── GET /api/reviews ─────────────────────────────────────────────────────────
// Returns all saved reviews, sorted newest first
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("getAllReviews error:", error.message);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ─── GET /api/health ──────────────────────────────────────────────────────────
// Simple health check — use this in Thunder Client to confirm the server is up
const healthCheck = (req, res) => {
  return res.status(200).json({ status: "ok", message: "Server is running" });
};

module.exports = { submitReview, getReviewById, getAllReviews, healthCheck };
