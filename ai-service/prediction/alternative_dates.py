"""
Alternative Date Prediction Engine
Compares nearby dates (-2 to +2 days) using actual model predictions to identify optimal travel windows.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List
from prediction.predictor import TravelPredictor

class AlternativeDateAdvisor:
    def __init__(self, predictor: TravelPredictor):
        self.predictor = predictor

    def compare_dates(
        self,
        origin: str,
        destination: str,
        target_date: str,
        transport_mode: str = "train",
        passengers: int = 1,
        day_range: int = 2
    ) -> Dict[str, Any]:
        """
        Evaluates target_date and dates from -day_range to +day_range.
        """
        try:
            base_dt = datetime.strptime(target_date, "%Y-%m-%d")
        except Exception:
            base_dt = datetime.now()

        comparisons: List[Dict[str, Any]] = []
        best_date = None
        min_demand = 999.0

        for offset in range(-day_range, day_range + 1):
            eval_dt = base_dt + timedelta(days=offset)
            date_str = eval_dt.strftime("%Y-%m-%d")
            
            # Run actual predictor
            pred = self.predictor.predict(
                origin=origin,
                destination=destination,
                travel_date=date_str,
                transport_mode=transport_mode,
                passengers=passengers
            )

            is_selected = (offset == 0)
            score = pred["demand_score"]
            if score < min_demand:
                min_demand = score
                best_date = date_str

            comparisons.append({
                "date": date_str,
                "display_date": eval_dt.strftime("%b %d (%a)"),
                "is_selected": is_selected,
                "offset_days": offset,
                "demand_score": score,
                "demand": "High" if score >= 65 else ("Medium" if score >= 45 else "Low"),
                "crowd_level": pred["crowd_level"],
                "delay_risk": pred["delay_risk"],
                "price_risk": pred["price_risk"],
                "holiday_factor": pred["holiday_factor"],
                "is_long_weekend": pred["holiday_info"]["is_long_weekend"],
                "proximity_note": pred["holiday_info"]["proximity_description"]
            })

        # Formulate Smart Advisor Recommendation
        selected_pred = next((c for c in comparisons if c["is_selected"]), comparisons[0])
        advisor_notes = []

        if selected_pred["demand_score"] > min_demand + 10:
            diff = round(selected_pred["demand_score"] - min_demand, 1)
            advisor_notes.append(
                f"Traveling on {best_date} can reduce expected travel crowd and demand by {diff}%."
            )
            advisor_notes.append(
                f"Lower congestion on {best_date} also minimizes risk of transit delays."
            )
        else:
            advisor_notes.append(
                f"Your selected date ({target_date}) has reasonable demand compared to neighboring days."
            )

        return {
            "selected_date": target_date,
            "best_recommended_date": best_date,
            "comparisons": comparisons,
            "advisor_recommendation": advisor_notes
        }
