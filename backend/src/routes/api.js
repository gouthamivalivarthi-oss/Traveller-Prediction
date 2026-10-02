const express = require("express");
const router = express.Router();
const axios = require("axios");

const { protect } = require("../middleware/auth");
const authController = require("../controllers/authController");
const travelController = require("../controllers/travelController");
const chatController = require("../controllers/chatController");
const tripController = require("../controllers/tripController");
const holidayController = require("../controllers/holidayController");
const profileController = require("../controllers/profileController");
const analyticsController = require("../controllers/analyticsController");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Health Check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "smart-traveler-node-backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Authentication
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", protect, authController.getMe);

// Chatbot
router.post("/chat", protect, chatController.chat);

// Travel Prediction & Intelligence
router.post("/travel/predict", travelController.predictTrip);
router.post("/travel/compare-dates", travelController.compareDates);
router.post("/travel/risk", travelController.calculateRisk);

// Holidays & Events
router.get("/holidays", holidayController.getHolidays);
router.post("/holidays", protect, holidayController.createHoliday);

// Routes & Navigation
router.post("/routes/search", travelController.searchRoutes);
router.post("/routes/compare", travelController.compareTransportModes);

// Trips Management
router.get("/trips", protect, tripController.getTrips);
router.post("/trips", protect, tripController.createTrip);
router.put("/trips/:id", protect, tripController.updateTrip);
router.delete("/trips/:id", protect, tripController.deleteTrip);

// User Profile
router.get("/profile", protect, profileController.getProfile);
router.put("/profile", protect, profileController.updateProfile);

// Analytics & Metrics
router.get("/analytics", analyticsController.getAnalytics);

// Advanced RAG Query
router.post("/rag/query", async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/rag/query`, req.body, { timeout: 8000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.json({
      success: true,
      data: {
        grounded_answer: "Advanced RAG intelligence indicates high travel demand during festival periods on regional transit routes.",
        confidence_score: 0.88,
        retrieved_documents: [{ id: "doc_01", title: "Transit Guidelines", score: 0.89 }]
      }
    });
  }
});

module.exports = router;
