const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "30d" });
};

// Demo user in-memory fallback
let demoUsers = [
  {
    _id: "demo_user_1",
    name: "Gouthami",
    email: "gouthami@smarttravel.ai",
    role: "user",
    preferred_transport: "train",
    budget: "Medium",
    preferred_travel_time: "Morning (06:00 - 10:00)",
    frequent_destinations: ["Hyderabad", "Vijayawada"],
    max_duration: "6 hours",
    travel_preferences: "Window seat, punctual train departures, vegetarian meal options"
  }
];

exports.register = async (req, res) => {
  try {
    const { name, email, password, preferred_transport, budget } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: "User already exists with this email." });
      }

      user = await User.create({
        name,
        email,
        password,
        preferred_transport: preferred_transport || "train",
        budget: budget || "Medium"
      });

      const token = generateToken(user._id, user.email, user.role);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferred_transport: user.preferred_transport,
          budget: user.budget
        }
      });
    } catch (dbErr) {
      // In-memory fallback
      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email,
        role: "user",
        preferred_transport: preferred_transport || "train",
        budget: budget || "Medium"
      };
      demoUsers.push(newUser);
      const token = generateToken(newUser._id, newUser.email, newUser.role);
      return res.status(201).json({ success: true, token, user: newUser });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.email, user.role);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            preferred_transport: user.preferred_transport,
            budget: user.budget,
            frequent_destinations: user.frequent_destinations
          }
        });
      }
    } catch (dbErr) {
      // Check in-memory demo
    }

    // Default demo login convenience
    const demoUser = demoUsers[0];
    const token = generateToken(demoUser._id, demoUser.email, demoUser.role);
    return res.json({
      success: true,
      token,
      user: demoUser,
      demoNote: "Logged in via Demo Profile"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
