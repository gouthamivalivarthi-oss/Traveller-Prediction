const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "smart_traveler_secret_key_2026";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Allow guest access if no token provided or "guest"
  if (!token || token === "null" || token === "guest_token") {
    req.user = {
      _id: "demo_guest_user_id",
      name: "Demo Traveler",
      email: "traveler@smarttravel.ai",
      role: "user",
      preferred_transport: "train",
      budget: "Medium",
      frequent_destinations: ["Hyderabad", "Vijayawada"]
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    try {
      const dbUser = await User.findById(decoded.id).select("-password");
      if (dbUser) {
        req.user = dbUser;
        return next();
      }
    } catch (dbErr) {
      // fallback to decoded token payload
    }
    req.user = { _id: decoded.id, email: decoded.email, role: decoded.role || "user" };
    next();
  } catch (error) {
    // If token invalid, proceed gracefully as guest user for seamless demo experience
    req.user = {
      _id: "demo_guest_user_id",
      name: "Demo Traveler",
      email: "traveler@smarttravel.ai",
      role: "user",
      preferred_transport: "train"
    };
    next();
  }
};

module.exports = { protect, JWT_SECRET };
