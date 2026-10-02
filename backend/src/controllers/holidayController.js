const path = require("path");
const fs = require("fs");
const Holiday = require("../models/Holiday");

const DEMO_HOLIDAYS_PATH = path.join(__dirname, "../../../data/demo_holidays.json");
const DEMO_EVENTS_PATH = path.join(__dirname, "../../../data/demo_events.json");

exports.getHolidays = async (req, res) => {
  try {
    let holidays = [];
    let events = [];

    // Try reading demo reference files
    if (fs.existsSync(DEMO_HOLIDAYS_PATH)) {
      holidays = JSON.parse(fs.readFileSync(DEMO_HOLIDAYS_PATH, "utf-8"));
    }
    if (fs.existsSync(DEMO_EVENTS_PATH)) {
      events = JSON.parse(fs.readFileSync(DEMO_EVENTS_PATH, "utf-8"));
    }

    try {
      const dbHolidays = await Holiday.find().sort({ date: 1 });
      if (dbHolidays && dbHolidays.length > 0) {
        holidays = [...dbHolidays, ...holidays];
      }
    } catch (dbErr) {}

    return res.json({
      success: true,
      count: holidays.length,
      holidays,
      events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const { name, date, endDate, location, type, importance, description } = req.body;
    if (!name || !date) {
      return res.status(400).json({ success: false, message: "Name and Date are required." });
    }

    let savedHoliday = {
      _id: `h_${Date.now()}`,
      name,
      date,
      endDate: endDate || date,
      location: location || "National",
      type: type || "holiday",
      importance: importance || "high",
      description: description || ""
    };

    try {
      const dbH = await Holiday.create(savedHoliday);
      savedHoliday = dbH;
    } catch (dbErr) {}

    return res.status(201).json({ success: true, data: savedHoliday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
