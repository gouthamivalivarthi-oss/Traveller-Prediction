const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, default: "traveler@example.com" },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    travelDate: { type: String, required: true },
    returnDate: { type: String },
    transportMode: { type: String, default: "train" },
    passengers: { type: Number, default: 1 },
    budget: { type: String, default: "Medium" },
    purpose: { type: String, default: "Leisure" },
    demandScore: { type: Number, default: 50 },
    crowdLevel: { type: String, default: "MEDIUM" },
    delayRisk: { type: String, default: "LOW" },
    priceRisk: { type: String, default: "MEDIUM" },
    overallRiskScore: { type: Number, default: 45 },
    overallRiskLevel: { type: String, default: "MEDIUM" },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled", "Saved"],
      default: "Upcoming"
    },
    notes: { type: String, default: "" },
    predictionData: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
