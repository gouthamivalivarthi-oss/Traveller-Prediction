require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const path = require("path");
const fs = require("fs");

// API Routes
app.use("/api", apiRoutes);

// Serve frontend static build if present (Production / Docker / Render)
const publicDir = path.join(__dirname, "../public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  // Root Welcome Route fallback when running pure API
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to AI-Powered Smart Traveler Prediction and Assistant API",
      status: "running",
      version: "1.0.0",
      docs: "/api/health",
      architecture: {
        frontend: "React Vite (Port 5173)",
        backend: "Node.js Express (Port 5000)",
        ai_service: "Python FastAPI (Port 8000)",
        database: "MongoDB (Port 27017)"
      }
    });
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("[Backend Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Smart Traveler Backend running on port ${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
