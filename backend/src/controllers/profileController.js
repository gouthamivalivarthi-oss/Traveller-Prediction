const User = require("../models/User");

let activeProfile = {
  name: "Gouthami",
  email: "gouthami@smarttravel.ai",
  preferred_transport: "train",
  budget: "Medium",
  preferred_travel_time: "Morning (06:00 - 10:00)",
  frequent_destinations: ["Hyderabad", "Vijayawada"],
  max_duration: "6 hours",
  travel_preferences: "Window seat, punctual train departures, vegetarian meal options",
  role: "user"
};

exports.getProfile = async (req, res) => {
  try {
    if (req.user && req.user._id && req.user._id !== "demo_guest_user_id") {
      try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) return res.json({ success: true, data: user });
      } catch (err) {}
    }
    return res.json({ success: true, data: activeProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (req.user && req.user._id && req.user._id !== "demo_guest_user_id") {
      try {
        const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
        if (updated) return res.json({ success: true, data: updated });
      } catch (err) {}
    }

    activeProfile = { ...activeProfile, ...updates };
    return res.json({ success: true, data: activeProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
