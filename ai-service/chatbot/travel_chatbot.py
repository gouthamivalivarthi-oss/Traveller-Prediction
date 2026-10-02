"""
AI Travel Chatbot Engine
Integrates:
- Unified Travel Dialogue Model (AirDialogue, MultiWOZ, TM2)
- Intent Detection & Slot Extraction
- Prediction Engine, Holiday Engine, Risk Engine, and Alternative Date Advisor
- Advanced RAG Pipeline for Travel FAQs and Guidelines
- Personalization from User Profile
- Interactive Action Buttons (Compare Dates, Find Routes, Check Holidays, Plan Complete Trip)
"""

import os
import re
import json
import joblib
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from prediction.predictor import TravelPredictor
from prediction.alternative_dates import AlternativeDateAdvisor
from rag.rag_pipeline import AdvancedRAGPipeline

class TravelChatbot:
    def __init__(self, predictor: TravelPredictor, rag_pipeline: AdvancedRAGPipeline, models_dir: str = None):
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.models_dir = models_dir or os.path.join(base, "models")
        self.predictor = predictor
        self.rag = rag_pipeline
        self.date_advisor = AlternativeDateAdvisor(predictor)

        # Load Intent Classifier & Vectorizer
        self.tfidf = joblib.load(os.path.join(self.models_dir, "tfidf_vectorizer.joblib"))
        self.intent_clf = joblib.load(os.path.join(self.models_dir, "intent_classifier.joblib"))

    def detect_intent(self, user_message: str) -> str:
        """
        Classifies user query into one of the 21 Unified Travel Intents.
        """
        msg_clean = user_message.lower().strip()

        # Keyword heuristics for high-precision override
        if any(w in msg_clean for w in ["compare date", "alternative date", "cheaper date", "friday or saturday", "earlier or later"]):
            return "alternative_date"
        if any(w in msg_clean for w in ["route", "alternate route", "bypass", "highway"]):
            return "route_search"
        if any(w in msg_clean for w in ["holiday", "festival", "long weekend", "public holiday", "dussehra", "diwali"]):
            return "holiday_query"
        if any(w in msg_clean for w in ["risk", "why is risk high", "safety"]):
            return "travel_risk"
        if any(w in msg_clean for w in ["price", "ticket price", "fare increase", "surge", "cheap"]):
            return "price_prediction"
        if any(w in msg_clean for w in ["delay", "on time", "traffic jam", "punctual"]):
            return "delay_prediction"
        if any(w in msg_clean for w in ["transport mode", "train or bus", "flight vs train", "which vehicle"]):
            return "transport_recommendation"
        if any(w in msg_clean for w in ["crowded", "crowd", "rush", "busy"]):
            return "crowd_prediction"
        if any(w in msg_clean for w in ["weather", "rain", "fog", "cyclone", "temperature"]):
            return "weather_query"
        if any(w in msg_clean for w in ["plan my trip", "itinerary", "plan a trip"]):
            return "trip_planning"

        # Fallback to ML classifier
        vec = self.tfidf.transform([user_message])
        pred_intent = self.intent_clf.predict(vec)[0]
        return pred_intent

    def extract_slots(self, user_message: str) -> Dict[str, Any]:
        """
        Extracts travel slots: origin, destination, travel_date, return_date, transport_mode, passengers, budget
        """
        text = user_message
        text_lower = text.lower()
        slots = {
            "origin": "",
            "destination": "",
            "travel_date": "",
            "return_date": "",
            "transport_mode": "",
            "passengers": 1,
            "budget": "",
            "purpose": ""
        }

        # Cities dictionary
        known_cities = ["hyderabad", "vijayawada", "bangalore", "bengaluru", "goa", "chennai", "tirupati", "mumbai", "pune", "delhi", "jaipur", "manali", "kolkata", "warangal"]

        # Regex for "from X to Y"
        from_to_match = re.search(r"from\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+on|\s+this|\s+next|\s+for|\.|$)", text_lower)
        if from_to_match:
            slots["origin"] = from_to_match.group(1).strip().title()
            slots["destination"] = from_to_match.group(2).strip().title()
        else:
            # Check individual city occurrences
            found_cities = [c.title() for c in known_cities if c in text_lower]
            if len(found_cities) >= 2:
                slots["origin"] = found_cities[0]
                slots["destination"] = found_cities[1]
            elif len(found_cities) == 1:
                if "to " in text_lower or "visit" in text_lower:
                    slots["destination"] = found_cities[0]
                else:
                    slots["origin"] = found_cities[0]

        # Date extraction
        today = datetime.now()
        if "tomorrow" in text_lower:
            slots["travel_date"] = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        elif "next weekend" in text_lower or "weekend" in text_lower:
            # Next Saturday
            days_ahead = 5 - today.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            slots["travel_date"] = (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")
        elif "october 20" in text_lower or "20 october" in text_lower or "20th october" in text_lower:
            slots["travel_date"] = "2026-10-20"
        elif "october 18" in text_lower:
            slots["travel_date"] = "2026-10-18"
        elif "diwali" in text_lower:
            slots["travel_date"] = "2026-11-08"
        elif "christmas" in text_lower:
            slots["travel_date"] = "2026-12-25"
        else:
            # Regex for YYYY-MM-DD
            iso_match = re.search(r"\b(202[6-9]-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b", text)
            if iso_match:
                slots["travel_date"] = iso_match.group(1)

        # Transport mode
        for m in ["train", "flight", "bus", "car", "taxi"]:
            if m in text_lower:
                slots["transport_mode"] = m
                break

        # Passengers
        pass_match = re.search(r"(\d+)\s*(?:people|person|passengers|pax|travelers)", text_lower)
        if pass_match:
            slots["passengers"] = int(pass_match.group(1))

        return slots

    def process_message(
        self,
        user_message: str,
        chat_history: List[Dict[str, str]] = None,
        user_profile: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Coordinates full chatbot interaction flow:
        - Intent detection
        - Slot extraction
        - Personalization
        - Prediction / RAG invocation
        - Interactive action generation
        """
        chat_history = chat_history or []
        user_profile = user_profile or {}

        intent = self.detect_intent(user_message)
        slots = self.extract_slots(user_message)

        # Merge defaults from User Profile if slots are missing
        preferred_mode = slots["transport_mode"] or user_profile.get("preferred_transport", "train").lower()
        origin = slots["origin"] or (user_profile.get("frequent_destinations", ["Hyderabad"])[0] if "Hyderabad" not in slots["destination"] else "Hyderabad")
        destination = slots["destination"]
        travel_date = slots["travel_date"] or "2026-10-20"  # Default sample travel date

        response_text = ""
        prediction_card = None
        action_buttons = []
        requires_prediction = False

        # Intent handling
        if intent in ["travel_search", "crowd_prediction", "demand_prediction", "travel_risk", "price_prediction", "delay_prediction"] or (origin and destination):
            requires_prediction = True

        # Check for alternative date request
        if intent == "alternative_date":
            comp = self.date_advisor.compare_dates(
                origin=origin or "Hyderabad",
                destination=destination or "Vijayawada",
                target_date=travel_date,
                transport_mode=preferred_mode
            )
            response_text = (
                f"I've analyzed alternative travel dates around {travel_date} for {origin or 'Hyderabad'} → {destination or 'Vijayawada'}.\n\n"
                f"📊 Best Recommendation: Traveling on {comp['best_recommended_date']} offers the lowest crowd levels and transit delays.\n\n"
                + "\n".join([f"• {note}" for note in comp["advisor_recommendation"]])
            )
            action_buttons = ["Find Alternative Routes", "Check Holidays", "Plan Complete Trip"]
            return {
                "intent": intent,
                "slots": slots,
                "response": response_text,
                "prediction_card": None,
                "date_comparison": comp["comparisons"],
                "action_buttons": action_buttons
            }

        # Check for route search
        if intent in ["route_search", "alternative_route"]:
            response_text = (
                f"Here are the recommended route options from {origin or 'Hyderabad'} to {destination or 'Vijayawada'}:\n\n"
                f"🛣 **Route A (NH65 Express)**: 274 km, 4h 45m. Direct highway, highest frequency, but toll congestion during peak hours.\n"
                f"🛣 **Route B (State Highway Bypass)**: 298 km, 5h 25m. 24 km longer but avoids major toll bottlenecks with low crowd risk.\n"
                f"🛣 **Route C (Regional Transit Hub)**: Economical with high seat availability.\n\n"
                f"Would you like me to compare specific transit modes (Train vs Bus vs Flight)?"
            )
            action_buttons = ["Compare Dates", "Check Holidays", "Plan Complete Trip"]
            return {
                "intent": intent,
                "slots": slots,
                "response": response_text,
                "prediction_card": None,
                "action_buttons": action_buttons
            }

        # Check for holiday query
        if intent == "holiday_query":
            h_info = self.predictor.holiday_engine.analyze_date(travel_date, destination)
            h_list = h_info["exact_holidays"] + h_info["nearby_holidays"]
            if h_list:
                h_names = ", ".join([h["name"] for h in h_list])
                response_text = (
                    f"📅 **Holiday Detection for {travel_date}**:\n"
                    f"Found active holiday/festival period: **{h_names}**.\n"
                    f"• Proximity: {h_info['proximity_description']}\n"
                    f"• Holiday Factor: {int(h_info['holiday_factor'] * 100)}%\n"
                    f"• Long Weekend Impact: {'Yes' if h_info['is_long_weekend'] else 'No'}\n\n"
                    f"This festival period is expected to generate significant transit demand. Would you like me to check crowd levels?"
                )
            else:
                response_text = f"There are no major national holidays or festivals on {travel_date}. It is classified as a standard travel day ({h_info['weekday_name']})."
            action_buttons = ["Predict Travel Conditions", "Compare Dates", "Find Routes"]
            return {
                "intent": intent,
                "slots": slots,
                "response": response_text,
                "prediction_card": None,
                "action_buttons": action_buttons
            }

        # If origin and destination are present or prediction is needed
        if requires_prediction and (origin or destination):
            pred_origin = origin or "Hyderabad"
            pred_dest = destination or "Vijayawada"
            prediction = self.predictor.predict(
                origin=pred_origin,
                destination=pred_dest,
                travel_date=travel_date,
                transport_mode=preferred_mode,
                passengers=slots["passengers"]
            )

            # Personalization note if user has profile preferences
            pref_note = ""
            if user_profile.get("preferred_transport") and not slots["transport_mode"]:
                pref_note = f"\n\n*(Personalized for your preferred transport: {user_profile.get('preferred_transport')})*"

            response_text = (
                f"I've analyzed your travel conditions for **{pred_origin} → {pred_dest}** on **{travel_date}**.\n\n"
                f"**Prediction Summary:**\n"
                f"• Travel Demand: **{prediction['crowd_level']}** ({prediction['demand_score']}/100)\n"
                f"• Crowd Risk: **{prediction['crowd_level']}**\n"
                f"• Delay Risk: **{prediction['delay_risk']}**\n"
                f"• Price Risk: **{prediction['price_risk']}**\n"
                f"• Holiday/Event Proximity: **{prediction['holiday_info']['proximity_description']}**\n\n"
                f"**Why this prediction?**\n"
                + "\n".join([f"• {c['factor']}: {c['points']} points ({c['impact']} impact)" for c in prediction["explanation"]["contributions"] if c["points"] != "+0"])
                + f"\n\n**Advisor Recommendation:**\n"
                + "\n".join([f"• {r}" for r in prediction["recommendations"]])
                + pref_note
                + "\n\nWould you like me to compare nearby dates (e.g. October 18–22) or explore alternative routes?"
            )

            prediction_card = prediction
            action_buttons = ["Compare Dates", "Find Alternative Routes", "Check Holidays", "Plan Complete Trip"]

            return {
                "intent": intent,
                "slots": slots,
                "response": response_text,
                "prediction_card": prediction_card,
                "action_buttons": action_buttons
            }

        # General RAG fallback for travel questions, policies, guidelines
        rag_res = self.rag.answer_query(user_message)
        response_text = rag_res["grounded_answer"]
        action_buttons = ["Predict Trip", "Check Holidays", "Explore Routes"]

        return {
            "intent": intent,
            "slots": slots,
            "response": response_text,
            "prediction_card": None,
            "action_buttons": action_buttons
        }
