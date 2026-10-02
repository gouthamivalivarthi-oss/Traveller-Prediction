const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferred_transport: { type: String, default: "train" },
    budget: { type: String, default: "Medium" },
    preferred_travel_time: { type: String, default: "Morning (06:00 - 10:00)" },
    frequent_destinations: { type: [String], default: ["Hyderabad", "Vijayawada"] },
    max_duration: { type: String, default: "6 hours" },
    travel_preferences: { type: String, default: "Comfort, punctual departure, window seat" }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
