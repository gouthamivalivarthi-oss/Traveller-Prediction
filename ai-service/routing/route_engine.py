"""
Smart Route Planner & Transport Mode Recommendation Engine
Provides multi-route navigation alternatives (Route A, Route B, Route C) and cross-modal trade-off comparisons.
"""

import json
import os
from typing import Dict, Any, List, Optional
from prediction.predictor import TravelPredictor

class RouteEngine:
    def __init__(self, predictor: TravelPredictor, data_dir: str = None):
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.data_dir = data_dir or os.path.join(base, "data")
        self.predictor = predictor
        self.routes_db = []
        self.load_routes()

    def load_routes(self):
        r_file = os.path.join(self.data_dir, "demo_routes.json")
        if os.path.exists(r_file):
            with open(r_file, "r", encoding="utf-8") as f:
                self.routes_db = json.load(f)

    def plan_routes(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        departure_time: str = "08:00",
        preferred_mode: str = "train",
        priority: str = "Balanced"
    ) -> Dict[str, Any]:
        """
        Generates 3 route options (Route A, Route B, Route C) filtered by priority.
        """
        # Run prediction for base demand & delay context
        pred = self.predictor.predict(origin, destination, travel_date, transport_mode=preferred_mode)
        demand_level = pred["crowd_level"]
        delay_risk = pred["delay_risk"]

        # Approximate distance
        origin_l = origin.lower()
        dest_l = destination.lower()
        if "vijayawada" in dest_l or "vijayawada" in origin_l:
            base_dist = 274
        elif "goa" in dest_l:
            base_dist = 560
        elif "tirupati" in dest_l:
            base_dist = 135
        else:
            base_dist = 320

        # Construct Route A: Primary Express Route
        route_a = {
            "route_id": "route_a",
            "name": f"Route A: Express Corridor (via NH Highway)",
            "type": "Primary Express",
            "distance_km": base_dist,
            "duration": "4h 45m" if preferred_mode in ["car", "taxi", "train"] else ("1h 10m" if preferred_mode == "flight" else "6h 00m"),
            "duration_minutes": 285 if preferred_mode in ["car", "taxi", "train"] else (70 if preferred_mode == "flight" else 360),
            "estimated_cost": 450 if preferred_mode == "train" else (2800 if preferred_mode == "flight" else 650),
            "transfers": 0,
            "demand_level": demand_level,
            "delay_risk": delay_risk,
            "highlights": ["Direct highway access", "Highest frequency of transit runs", "Frequent rest stops"],
            "pros": "Fastest door-to-door transit",
            "cons": "Susceptible to peak rush tolls during festival periods"
        }

        # Construct Route B: Bypass / Lower Crowd Alternative
        route_b = {
            "route_id": "route_b",
            "name": f"Route B: State Bypass Route (Lesser Traffic)",
            "type": "Alternative Bypass",
            "distance_km": base_dist + 24,
            "duration": "5h 25m" if preferred_mode in ["car", "taxi", "train"] else ("1h 35m" if preferred_mode == "flight" else "6h 45m"),
            "duration_minutes": 325 if preferred_mode in ["car", "taxi", "train"] else (95 if preferred_mode == "flight" else 405),
            "estimated_cost": 380 if preferred_mode == "train" else (2400 if preferred_mode == "flight" else 580),
            "transfers": 0,
            "demand_level": "MEDIUM" if demand_level in ["VERY HIGH", "HIGH"] else "LOW",
            "delay_risk": "LOW",
            "highlights": ["Circumvents main toll congestion", "Scenic rural route", "Stable average speed"],
            "pros": "Significantly lower crowd pressure and delay risk",
            "cons": "Slightly longer distance (+24 km)"
        }

        # Construct Route C: Multi-modal / Junction Transit Route
        route_c = {
            "route_id": "route_c",
            "name": f"Route C: Regional Transit Interchange",
            "type": "Multi-Modal / Economy",
            "distance_km": base_dist + 38,
            "duration": "6h 15m" if preferred_mode in ["car", "taxi", "train"] else ("2h 30m" if preferred_mode == "flight" else "7h 30m"),
            "duration_minutes": 375 if preferred_mode in ["car", "taxi", "train"] else (150 if preferred_mode == "flight" else 450),
            "estimated_cost": 290 if preferred_mode == "train" else (1900 if preferred_mode == "flight" else 480),
            "transfers": 1,
            "demand_level": "LOW",
            "delay_risk": "MEDIUM",
            "highlights": ["Economical transfer option", "High seat availability at connecting hub"],
            "pros": "Most budget-friendly fare structure",
            "cons": "Requires 1 transfer at intermediate junction"
        }

        routes = [route_a, route_b, route_c]

        # Prioritize routes
        if priority.lower() == "fastest":
            routes.sort(key=lambda r: r["duration_minutes"])
        elif priority.lower() == "cheapest":
            routes.sort(key=lambda r: r["estimated_cost"])
        elif priority.lower() == "least crowded":
            crowd_rank = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "VERY HIGH": 4}
            routes.sort(key=lambda r: crowd_rank.get(r["demand_level"], 2))
        elif priority.lower() == "fewest transfers":
            routes.sort(key=lambda r: r["transfers"])

        return {
            "origin": origin,
            "destination": destination,
            "travel_date": travel_date,
            "departure_time": departure_time,
            "priority": priority,
            "routes": routes
        }

    def compare_transport_modes(
        self,
        origin: str,
        destination: str,
        travel_date: str
    ) -> Dict[str, Any]:
        """
        Compares all transport modes (Bus, Train, Flight, Taxi, Car, Public Transport)
        providing detailed trade-offs and rationale.
        """
        # Base predictions for each mode
        modes_spec = [
            {
                "mode": "Train",
                "duration": "4h 30m",
                "cost_inr": 350,
                "comfort": "High",
                "demand": "Medium",
                "delay_risk": "Medium",
                "co2_impact": "Low",
                "trade_off": "Best balance of cost and comfort. Reserve sleeper/AC seats early during festival dates."
            },
            {
                "mode": "Bus",
                "duration": "5h 45m",
                "cost_inr": 550,
                "comfort": "Medium",
                "demand": "High",
                "delay_risk": "High",
                "co2_impact": "Medium",
                "trade_off": "High departure frequency, but highway congestion can add 45-60 minutes."
            },
            {
                "mode": "Flight",
                "duration": "55m (flight) / 2h 45m (total)",
                "cost_inr": 2900,
                "comfort": "Very High",
                "demand": "Medium",
                "delay_risk": "Low",
                "co2_impact": "High",
                "trade_off": "Fastest option. Ideal for urgent schedules; highest price point."
            },
            {
                "mode": "Car (Self-Drive)",
                "duration": "5h 10m",
                "cost_inr": 2600,
                "comfort": "High",
                "demand": "Medium",
                "delay_risk": "Medium",
                "co2_impact": "High",
                "trade_off": "Maximum flexibility with stops; toll and fuel costs apply."
            },
            {
                "mode": "Taxi / Cab",
                "duration": "5h 10m",
                "cost_inr": 4200,
                "comfort": "High",
                "demand": "Low",
                "delay_risk": "Medium",
                "co2_impact": "High",
                "trade_off": "Door-to-door convenience with zero driving fatigue; premium cost."
            },
            {
                "mode": "Public Transport (State / Local)",
                "duration": "6h 30m",
                "cost_inr": 260,
                "comfort": "Basic",
                "demand": "Very High",
                "delay_risk": "High",
                "co2_impact": "Very Low",
                "trade_off": "Most economical; crowded with multiple stops."
            }
        ]

        return {
            "origin": origin,
            "destination": destination,
            "travel_date": travel_date,
            "modes_comparison": modes_spec,
            "summary_recommendation": (
                "For balanced budget and comfort, Train is recommended. "
                "If traveling in a family group of 3-4, Private Car or Taxi offers comparable per-person value."
            )
        }
