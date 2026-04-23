const mongoose = require("mongoose");

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
// Called once at server startup from server.js
// MONGO_URI is loaded from the .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails — no point running without DB
  }
};

module.exports = connectDB;
