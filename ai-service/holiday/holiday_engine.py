"""
Holiday & Event Engine
Detects national/regional holidays, festival periods, long weekends, and calculates holiday proximity factor.
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

class HolidayEngine:
    def __init__(self, data_dir: str = None):
        if not data_dir:
            data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
        self.data_dir = data_dir
        self.holidays = []
        self.events = []
        self.load_data()

    def load_data(self):
        h_file = os.path.join(self.data_dir, "demo_holidays.json")
        e_file = os.path.join(self.data_dir, "demo_events.json")

        if os.path.exists(h_file):
            with open(h_file, "r", encoding="utf-8") as f:
                self.holidays = json.load(f)
        if os.path.exists(e_file):
            with open(e_file, "r", encoding="utf-8") as f:
                self.events = json.load(f)

    def get_all_holidays(self) -> List[Dict[str, Any]]:
        return self.holidays

    def get_all_events(self) -> List[Dict[str, Any]]:
        return self.events

    def add_holiday(self, holiday_data: Dict[str, Any]):
        self.holidays.append(holiday_data)

    def analyze_date(self, date_str: str, location: str = "") -> Dict[str, Any]:
        """
        Analyzes a specific date for holiday, festival, event, and long weekend proximity.
        """
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
        except Exception:
            # Fallback to current year date parsing if invalid
            target_date = datetime.now()

        weekday = target_date.weekday()  # 5=Sat, 6=Sun, 4=Fri, 0=Mon
        is_weekend = weekday >= 5

        # Check exact matches
        exact_holidays = []
        for h in self.holidays:
            start = datetime.strptime(h["date"], "%Y-%m-%d")
            end = datetime.strptime(h.get("endDate", h["date"]), "%Y-%m-%d")
            if start <= target_date <= end:
                exact_holidays.append(h)

        # Check proximity (within +/- 2 days)
        nearby_holidays = []
        for h in self.holidays:
            start = datetime.strptime(h["date"], "%Y-%m-%d")
            end = datetime.strptime(h.get("endDate", h["date"]), "%Y-%m-%d")
            # Distance from target_date
            if abs((start - target_date).days) <= 2 or abs((end - target_date).days) <= 2:
                if h not in exact_holidays:
                    nearby_holidays.append(h)

        # Check events
        matched_events = []
        for e in self.events:
            start = datetime.strptime(e["date"], "%Y-%m-%d")
            end = datetime.strptime(e.get("endDate", e["date"]), "%Y-%m-%d")
            loc = e.get("location", "").lower()
            if start <= target_date <= end:
                if not location or location.lower() in loc or "national" in loc:
                    matched_events.append(e)

        # Long weekend logic:
        # If Friday is holiday -> Fri+Sat+Sun = Long weekend
        # If Monday is holiday -> Sat+Sun+Mon = Long weekend
        # If Saturday or Sunday holiday -> normal weekend
        is_long_weekend = False
        proximity_desc = "Normal travel day"
        holiday_factor = 0.15 if is_weekend else 0.05

        if exact_holidays:
            is_festival = any(h.get("type") == "festival" for h in exact_holidays)
            holiday_factor = 0.90 if is_festival else 0.75
            proximity_desc = f"Direct holiday/festival ({', '.join([h['name'] for h in exact_holidays])})"
            if weekday in [0, 4]:
                is_long_weekend = True
                holiday_factor = min(1.0, holiday_factor + 0.1)
                proximity_desc += " with Extended Long Weekend"
        elif nearby_holidays:
            holiday_factor = 0.55
            proximity_desc = f"Holiday proximity within 48h ({', '.join([h['name'] for h in nearby_holidays])})"
            if weekday in [0, 4, 5, 6]:
                is_long_weekend = True
                holiday_factor += 0.15
                proximity_desc += " connecting to Weekend"
        elif is_weekend:
            proximity_desc = "Standard weekend"
            holiday_factor = 0.35

        if matched_events:
            holiday_factor = min(1.0, holiday_factor + 0.20)
            proximity_desc += f" | Active Event: {', '.join([e['name'] for e in matched_events])}"

        return {
            "date": target_date.strftime("%Y-%m-%d"),
            "weekday_name": target_date.strftime("%A"),
            "is_weekend": is_weekend,
            "is_long_weekend": is_long_weekend,
            "holiday_factor": round(holiday_factor, 2),
            "exact_holidays": exact_holidays,
            "nearby_holidays": nearby_holidays,
            "matched_events": matched_events,
            "proximity_description": proximity_desc,
            "is_peak_period": holiday_factor >= 0.70
        }
