"""
Travel Risk Engine
Calculates multi-dimensional risk scores: Crowd, Delay, Weather, Holiday, Transport Availability, and Price Risk.
"""

from typing import Dict, Any

class RiskEngine:
    def __init__(self):
        self.risk_weights = {
            "crowd": 0.25,
            "delay": 0.20,
            "holiday": 0.20,
            "price": 0.15,
            "weather": 0.10,
            "availability": 0.10
        }

    def calculate_risk(
        self,
        crowd_level: str,
        delay_risk: str,
        holiday_factor: float,
        price_risk: str,
        weather_condition: str = "Clear",
        availability_pct: int = 70
    ) -> Dict[str, Any]:
        """
        Computes overall travel risk score (0-100) and detailed breakdowns.
        """
        # Map categorical to numeric scores 0-100
        level_map = {
            "VERY HIGH": 90,
            "HIGH": 75,
            "MEDIUM": 45,
            "LOW": 20
        }

        crowd_score = level_map.get(crowd_level.upper(), 45)
        delay_score = level_map.get(delay_risk.upper(), 35)
        price_score = level_map.get(price_risk.upper(), 40)
        holiday_score = int(holiday_factor * 100)

        # Weather score
        weather_lower = weather_condition.lower()
        if any(w in weather_lower for w in ["storm", "cyclone", "heavy rain", "dense fog"]):
            weather_score = 85
            weather_risk_level = "HIGH"
        elif any(w in weather_lower for w in ["rain", "fog", "shower"]):
            weather_score = 55
            weather_risk_level = "MEDIUM"
        else:
            weather_score = 15
            weather_risk_level = "LOW"

        # Availability score (inverse of availability: low availability = high risk)
        avail_risk_score = max(10, min(95, 100 - availability_pct))
        avail_risk_level = "HIGH" if avail_risk_score > 65 else ("MEDIUM" if avail_risk_score > 35 else "LOW")

        # Weighted calculation
        overall_score = (
            crowd_score * self.risk_weights["crowd"] +
            delay_score * self.risk_weights["delay"] +
            holiday_score * self.risk_weights["holiday"] +
            price_score * self.risk_weights["price"] +
            weather_score * self.risk_weights["weather"] +
            avail_risk_score * self.risk_weights["availability"]
        )
        overall_score = round(overall_score, 1)

        # Risk Classification
        if overall_score >= 75:
            overall_level = "VERY HIGH"
        elif overall_score >= 58:
            overall_level = "HIGH"
        elif overall_score >= 38:
            overall_level = "MEDIUM"
        else:
            overall_level = "LOW"

        # Actionable Advice
        mitigations = []
        if crowd_score >= 70:
            mitigations.append("Arrive 45-60 minutes earlier at transit terminals to navigate crowd checkpoints.")
        if delay_score >= 60:
            mitigations.append("Plan with a 1-2 hour buffer window; avoid tight connecting schedules.")
        if holiday_score >= 70:
            mitigations.append("Consider shifting departure by 24-48 hours to bypass peak festival rush.")
        if price_score >= 60:
            mitigations.append("Book tickets immediately; dynamic pricing surge is currently active.")
        if weather_score >= 50:
            mitigations.append(f"Monitor live regional weather forecasts ({weather_condition}).")

        if not mitigations:
            mitigations.append("Travel conditions are optimal. Safe travels!")

        return {
            "overall_score": overall_score,
            "overall_level": overall_level,
            "components": {
                "crowd_risk": {"score": crowd_score, "level": crowd_level},
                "delay_risk": {"score": delay_score, "level": delay_risk},
                "holiday_risk": {"score": holiday_score, "level": "HIGH" if holiday_score > 60 else ("MEDIUM" if holiday_score > 30 else "LOW")},
                "price_risk": {"score": price_score, "level": price_risk},
                "weather_risk": {"score": weather_score, "level": weather_risk_level, "condition": weather_condition},
                "availability_risk": {"score": avail_risk_score, "level": avail_risk_level, "availability_pct": availability_pct}
            },
            "mitigations": mitigations
        }
