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
      type: String,
      required: [true, "Suggestions are required"],
    },

    model: {
      type: String,
      default: "llama3-8b-8192",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Prevents Mongoose from adding __v (version key) to documents
    versionKey: false,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
