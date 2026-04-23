const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Code is required"],
      trim: true,
    },

    language: {
      type: String,
      default: "plaintext",
      trim: true,
    },

    suggestions: {
      type: mongoose.Schema.Types.Mixed, // Allows for a structured JSON object
      required: [true, "Suggestions are required"],
    },

    model: {
      type: String,
      default: "llama-3.3-70b-versatile",
    },

    responseTime: {
      type: Number, // Stored in milliseconds
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Prevents Mongoose from adding __v (version key) to documents
    versionKey: false,
  },
);

module.exports = mongoose.model("Review", reviewSchema);
