require("dotenv").config(); // Must be first — loads .env before any other module reads process.env
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const reviewRoutes = require("./routes/reviewRoutes");

// ─── App Init ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = clientUrl
  ? clientUrl.split(",").map(url => url.trim())
  : "http://localhost:5173";

app.use(cors({ origin: allowedOrigins })); // Allow specific origin(s)
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", reviewRoutes); // All review-related routes are prefixed with /api

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
