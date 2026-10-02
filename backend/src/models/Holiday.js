const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    endDate: { type: String },
    location: { type: String, default: "National" },
    type: { type: String, enum: ["holiday", "festival", "event", "long_weekend"], default: "holiday" },
    importance: { type: String, enum: ["low", "medium", "high"], default: "high" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
