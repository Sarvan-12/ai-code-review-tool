const Review = require("../models/Review");
const { getCodeReview } = require("../services/groqService");

// ─── POST /api/review ─────────────────────────────────────────────────────────
// Receives code + language, sends to Groq, saves result, returns structured JSON
const submitReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Basic input validation
    if (!code || code.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Code is required" });
    }

    // Upper limit validation to prevent rate limit burns or timeouts
    if (code.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Code exceeds the 5000 character limit",
      });
    }

    // Measure response time
    const startTime = Date.now();

    // Call Groq API via the service layer
    const suggestions = await getCodeReview(code, language);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Save the review result to MongoDB
    const review = await Review.create({
      code,
      language: language || "plaintext",
      suggestions,
      responseTime,
    });

    // Return structured response to frontend with an envelope
    return res.status(201).json({
      success: true,
      data: {
        id: review._id,
        language: review.language,
        suggestions: review.suggestions,
        model: review.model,
        responseTime: review.responseTime,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("submitReview error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to process review" });
  }
};

// ─── GET /api/review/:id ──────────────────────────────────────────────────────
// Fetches a single saved review document by its MongoDB ObjectId
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("getReviewById error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch review" });
  }
};

// ─── GET /api/reviews ─────────────────────────────────────────────────────────
// Returns all saved reviews, sorted newest first
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("getAllReviews error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch reviews" });
  }
};

// ─── GET /api/health ──────────────────────────────────────────────────────────
// Simple health check — use this in Thunder Client to confirm the server is up
const healthCheck = (req, res) => {
  return res.status(200).json({ success: true, message: "Server is running" });
};

module.exports = { submitReview, getReviewById, getAllReviews, healthCheck };
