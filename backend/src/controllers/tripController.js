const Trip = require("../models/Trip");

// In-memory demo store for fallback
let inMemoryTrips = [
  {
    _id: "trip_demo_1",
    userEmail: "gouthami@smarttravel.ai",
    origin: "Hyderabad",
    destination: "Vijayawada",
    travelDate: "2026-10-20",
    returnDate: "2026-10-23",
    transportMode: "train",
    passengers: 2,
    demandScore: 84,
    crowdLevel: "HIGH",
    delayRisk: "MEDIUM",
    priceRisk: "MEDIUM",
    overallRiskScore: 65,
    overallRiskLevel: "MEDIUM",
    status: "Upcoming",
    notes: "Dussehra holiday trip with family",
    createdAt: new Date().toISOString()
  },
  {
    _id: "trip_demo_2",
    userEmail: "gouthami@smarttravel.ai",
    origin: "Bangalore",
    destination: "Goa",
    travelDate: "2026-11-15",
    returnDate: "2026-11-18",
    transportMode: "flight",
    passengers: 1,
    demandScore: 52,
    crowdLevel: "MEDIUM",
    delayRisk: "LOW",
    priceRisk: "MEDIUM",
    overallRiskScore: 42,
    overallRiskLevel: "MEDIUM",
    status: "Saved",
    notes: "Weekend beach getaway",
    createdAt: new Date().toISOString()
  }
];

exports.getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    try {
      const query = {};
      if (status && status !== "All") query.status = status;
      const trips = await Trip.find(query).sort({ createdAt: -1 });
      if (trips && trips.length > 0) {
        return res.json({ success: true, count: trips.length, data: trips });
      }
    } catch (dbErr) {
      // fallback to memory
    }

    let filtered = inMemoryTrips;
    if (status && status !== "All") {
      filtered = inMemoryTrips.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.user?._id || "demo_guest_user_id",
      userEmail: req.user?.email || "traveler@example.com"
    };

    try {
      const newTrip = await Trip.create(tripData);
      return res.status(201).json({ success: true, data: newTrip });
    } catch (dbErr) {
      const memoryTrip = {
        _id: `trip_${Date.now()}`,
        ...tripData,
        createdAt: new Date().toISOString()
      };
      inMemoryTrips.unshift(memoryTrip);
      return res.status(201).json({ success: true, data: memoryTrip });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Trip.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (dbErr) {}

    const idx = inMemoryTrips.findIndex((t) => t._id === id);
    if (idx !== -1) {
      inMemoryTrips[idx] = { ...inMemoryTrips[idx], ...req.body };
      return res.json({ success: true, data: inMemoryTrips[idx] });
    }

    return res.status(404).json({ success: false, message: "Trip not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Trip.findByIdAndDelete(id);
    } catch (dbErr) {}

    inMemoryTrips = inMemoryTrips.filter((t) => t._id !== id);
    return res.json({ success: true, message: "Trip deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
