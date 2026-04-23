const express = require("express");
const router = express.Router();
const {
  submitReview,
  getReviewById,
  getAllReviews,
  healthCheck,
} = require("../controllers/reviewController");

// ─── Routes ───────────────────────────────────────────────────────────────────
// This file only defines routes — all logic lives in reviewController.js

router.get("/health", healthCheck);           // GET  /api/health       → server status check
router.post("/review", submitReview);         // POST /api/review       → submit code for AI review
router.get("/review/:id", getReviewById);     // GET  /api/review/:id   → fetch one review by ID
router.get("/reviews", getAllReviews);         // GET  /api/reviews      → list all past reviews

module.exports = router;
