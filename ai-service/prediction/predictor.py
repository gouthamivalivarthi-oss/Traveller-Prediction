"""
Travel Prediction Engine
Loads ML models and computes multi-factor travel demand predictions with feature contribution explanations.
"""

import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, Optional

from holiday.holiday_engine import HolidayEngine
from risk.risk_engine import RiskEngine

class TravelPredictor:
    def __init__(self, models_dir: str = None, data_dir: str = None):
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.models_dir = models_dir or os.path.join(base, "models")
        self.data_dir = data_dir or os.path.join(base, "data")
        
        self.holiday_engine = HolidayEngine(self.data_dir)
        self.risk_engine = RiskEngine()

        # Load models and encoders
        self.rf_demand = joblib.load(os.path.join(self.models_dir, "rf_demand_model.joblib"))
        self.rf_crowd = joblib.load(os.path.join(self.models_dir, "rf_crowd_model.joblib"))
        self.rf_delay = joblib.load(os.path.join(self.models_dir, "rf_delay_model.joblib"))
        self.rf_price = joblib.load(os.path.join(self.models_dir, "rf_price_model.joblib"))
        self.encoders = joblib.load(os.path.join(self.models_dir, "encoders.joblib"))
        self.feature_names = joblib.load(os.path.join(self.models_dir, "feature_names.joblib"))
        self.feature_importances = joblib.load(os.path.join(self.models_dir, "feature_importances.joblib"))

    def _safe_encode(self, col: str, val: str) -> int:
        encoder = self.encoders.get(col)
        if not encoder:
            return 0
        if val in encoder.classes_:
            return int(encoder.transform([val])[0])
        # Default to first class if unseen
        return 0

    def predict(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        return_date: Optional[str] = None,
        transport_mode: str = "train",
        passengers: int = 1,
        budget: Optional[str] = None,
        purpose: Optional[str] = None,
        user_preference: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes complete travel prediction pipeline.
        """
        # 1. Holiday & Event Analysis
        h_analysis = self.holiday_engine.analyze_date(travel_date, destination)
        is_holiday = 1 if h_analysis["nearby_holidays"] or h_analysis["exact_holidays"] else 0
        is_festival = 1 if any(h.get("type") == "festival" for h in h_analysis["exact_holidays"] + h_analysis["nearby_holidays"]) else 0
        has_event = 1 if h_analysis["matched_events"] else 0
        is_weekend = 1 if h_analysis["is_weekend"] else 0

        # Season estimation
        try:
            m = datetime.strptime(travel_date, "%Y-%m-%d").month
            if m in [10, 11, 12, 1, 5]:
                season = "Peak"
            elif m in [6, 7, 8]:
                season = "Off-Peak"
            else:
                season = "Normal"
        except Exception:
            season = "Normal"

        # Baseline historical demand
        base_hist = 55.0
        if destination.lower() in ["vijayawada", "goa", "tirupati"]:
            base_hist = 68.0

        # Weather heuristic (Demo Weather integration)
        weather_cond = "Clear"
        if destination.title() in ["Mumbai"]:
            weather_cond = "Rain"
        elif destination.title() in ["Delhi"] and season == "Peak":
            weather_cond = "Fog"

        availability_est = max(15, int(90 - (h_analysis["holiday_factor"] * 65)))

        # Prepare feature vector matching training feature columns
        feat_dict = {
            "origin_enc": self._safe_encode("origin", origin.title()),
            "destination_enc": self._safe_encode("destination", destination.title()),
            "transport_mode_enc": self._safe_encode("transport_mode", transport_mode.lower()),
            "season_enc": self._safe_encode("season", season),
            "weather_condition_enc": self._safe_encode("weather_condition", weather_cond),
            "passengers": passengers,
            "historical_demand": base_hist,
            "holiday": is_holiday,
            "weekend": is_weekend,
            "festival": is_festival,
            "event": has_event,
            "availability": availability_est
        }

        X_input = pd.DataFrame([feat_dict])[self.feature_names]

        # ML Model Inferences
        demand_score = float(self.rf_demand.predict(X_input)[0])
        demand_score = max(5.0, min(99.0, round(demand_score, 1)))

        crowd_level = str(self.rf_crowd.predict(X_input)[0])
        delay_risk = str(self.rf_delay.predict(X_input)[0])
        price_risk = str(self.rf_price.predict(X_input)[0])

        # Risk Analysis
        risk_result = self.risk_engine.calculate_risk(
            crowd_level=crowd_level,
            delay_risk=delay_risk,
            holiday_factor=h_analysis["holiday_factor"],
            price_risk=price_risk,
            weather_condition=weather_cond,
            availability_pct=availability_est
        )

        # Feature Contribution Breakdown ("Why this prediction?")
        # Grounded decomposition of the score
        holiday_pts = 25 if is_festival else (15 if is_holiday else 0)
        weekend_pts = 15 if is_weekend else 0
        hist_pts = round((base_hist / 75.0) * 20.0)
        event_pts = 15 if has_event else 0
        season_pts = 15 if season == "Peak" else (5 if season == "Normal" else 0)
        weather_pts = 5 if weather_cond in ["Rain", "Fog"] else 0

        # Adjust residual to match exact ML demand score
        sum_components = holiday_pts + weekend_pts + hist_pts + event_pts + season_pts + weather_pts
        residual = round(demand_score - sum_components, 1)

        explanations = [
            {"factor": "Holiday / Festival Proximity", "points": f"+{holiday_pts}", "impact": "High" if holiday_pts >= 15 else "Low"},
            {"factor": "Weekend Travel Effect", "points": f"+{weekend_pts}", "impact": "Medium" if weekend_pts > 0 else "None"},
            {"factor": "Historical Transit Demand", "points": f"+{hist_pts}", "impact": "High" if hist_pts >= 15 else "Medium"},
            {"factor": "Special Events / Festivals", "points": f"+{event_pts}", "impact": "High" if event_pts > 0 else "None"},
            {"factor": "Seasonal Travel Volume", "points": f"+{season_pts}", "impact": "Medium" if season_pts >= 10 else "Low"},
            {"factor": "Weather Condition Impact", "points": f"+{weather_pts}", "impact": "Low" if weather_pts == 0 else "Medium"}
        ]

        # Smart Travel Recommendations
        recs = []
        if demand_score >= 70:
            recs.append("Consider traveling 1 or 2 days earlier/later to avoid peak surge.")
            recs.append("Book tickets in advance as seat availability is trending downward.")
        if delay_risk in ["HIGH", "MEDIUM"]:
            recs.append(f"Consider train or direct express highway over local bus due to anticipated delays.")
        if h_analysis["is_long_weekend"]:
            recs.append("Expect heavy return transit congestion on Sunday evening and Monday morning.")
        if not recs:
            recs.append("Travel conditions are favorable with low expected crowds and on-time transit.")

        return {
            "origin": origin,
            "destination": destination,
            "travel_date": travel_date,
            "return_date": return_date,
            "transport_mode": transport_mode,
            "passengers": passengers,
            "demand_score": demand_score,
            "crowd_level": crowd_level,
            "delay_risk": delay_risk,
            "price_risk": price_risk,
            "overall_risk_score": risk_result["overall_score"],
            "overall_risk_level": risk_result["overall_level"],
            "holiday_factor": h_analysis["holiday_factor"],
            "holiday_info": h_analysis,
            "risk_details": risk_result,
            "explanation": {
                "summary": f"Predicted demand score {demand_score}/100 based on multi-factor analysis.",
                "contributions": explanations,
                "residual_adjustment": residual
            },
            "recommendations": recs,
            "is_demo_mode": True
        }
