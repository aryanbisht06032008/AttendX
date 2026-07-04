const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 AttendX Backend is Running...");
});

const PORT = process.env.PORT || 5000;

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to AttendX!",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});