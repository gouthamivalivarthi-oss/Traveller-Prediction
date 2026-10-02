const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smart_traveler";
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection notice: ${error.message}. Running in resilient mode.`);
    return false;
  }
};

module.exports = connectDB;
