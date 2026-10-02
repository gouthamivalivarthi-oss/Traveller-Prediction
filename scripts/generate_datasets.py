"""
Dataset Generation and Unification Script
Creates:
1. Raw sample dialogues for AirDialogue, MultiWOZ, and TM2 in data/raw/
2. Unified dialogue format in data/processed/unified_travel_dialogues.json
3. Labeled simulated travel demand dataset in data/travel_demand/demo_travel_demand.csv
4. Demo reference data: demo_holidays.json, demo_events.json, demo_routes.json, demo_weather.json
"""

import json
import os
import random
import csv
from datetime import datetime, timedelta

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
DEMAND_DIR = os.path.join(DATA_DIR, "travel_demand")

os.makedirs(os.path.join(RAW_DIR, "airdialogue"), exist_ok=True)
os.makedirs(os.path.join(RAW_DIR, "multiwoz"), exist_ok=True)
os.makedirs(os.path.join(RAW_DIR, "tm2"), exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(DEMAND_DIR, exist_ok=True)

# 1. Raw Dataset Samples
# AirDialogue sample format (flight goal-oriented dialogue)
airdialogue_samples = [
    {
        "id": "ad_101",
        "context": {"origin": "Hyderabad", "destination": "Vijayawada", "flight_date": "2026-10-20", "passengers": 2},
        "dialogue": [
            {"speaker": "user", "text": "I need flights from Hyderabad to Vijayawada on October 20 for 2 passengers."},
            {"speaker": "agent", "text": "Checking availability for October 20 from Hyderabad to Vijayawada."},
            {"speaker": "user", "text": "What is the fare and will there be high crowds?"},
            {"speaker": "agent", "text": "Fares start at 3200 INR. High demand expected due to the holiday season."}
        ],
        "action": "search_flight",
        "status": "completed"
    },
    {
        "id": "ad_102",
        "context": {"origin": "Bangalore", "destination": "Goa", "flight_date": "2026-11-15", "passengers": 1},
        "dialogue": [
            {"speaker": "user", "text": "Book a cheap flight from Bangalore to Goa next Friday morning."},
            {"speaker": "agent", "text": "Found 3 flights starting at 2800 INR for next Friday morning."},
            {"speaker": "user", "text": "Are there delays expected?"},
            {"speaker": "agent", "text": "Morning flights have on-time rating of 94%."}
        ],
        "action": "book_flight",
        "status": "completed"
    },
    {
        "id": "ad_103",
        "context": {"origin": "Delhi", "destination": "Jaipur", "flight_date": "2026-10-25", "passengers": 4},
        "dialogue": [
            {"speaker": "user", "text": "Cancel my booking from Delhi to Jaipur on 25th October."},
            {"speaker": "agent", "text": "Your cancellation request for Delhi to Jaipur has been received."}
        ],
        "action": "cancel_booking",
        "status": "cancelled"
    },
    {
        "id": "ad_104",
        "context": {"origin": "Mumbai", "destination": "Chennai", "flight_date": "2026-12-24", "passengers": 1},
        "dialogue": [
            {"speaker": "user", "text": "Can I change my travel date from December 24 to December 26?"},
            {"speaker": "agent", "text": "Yes, rescheduling to December 26 is possible with a nominal change fee."}
        ],
        "action": "change_booking",
        "status": "rescheduled"
    }
]

with open(os.path.join(RAW_DIR, "airdialogue", "sample_airdialogue.json"), "w", encoding="utf-8") as f:
    json.dump(airdialogue_samples, f, indent=2)

# MultiWOZ sample format (multi-domain task dialogue: train, hotel, taxi)
multiwoz_samples = [
    {
        "dialogue_id": "mwoz_201",
        "turns": [
            {"speaker": "USER", "utterance": "I want to take a train from Hyderabad to Tirupati this Saturday."},
            {"speaker": "SYSTEM", "utterance": "There are several trains leaving Saturday. What departure time do you prefer?"},
            {"speaker": "USER", "utterance": "Morning train preferred. Is Saturday crowded?"},
            {"speaker": "SYSTEM", "utterance": "Weekend trains to Tirupati have high demand. Express at 06:15 AM is available."}
        ],
        "domain": "train",
        "goal": {"train": {"departure": "Hyderabad", "destination": "Tirupati", "day": "Saturday"}}
    },
    {
        "dialogue_id": "mwoz_202",
        "turns": [
            {"speaker": "USER", "utterance": "What is the best route to travel from Chennai to Bangalore avoiding delays?"},
            {"speaker": "SYSTEM", "utterance": "The Shatabdi Express route has the lowest delay probability and fastest travel time."}
        ],
        "domain": "route",
        "goal": {"route": {"from": "Chennai", "to": "Bangalore"}}
    },
    {
        "dialogue_id": "mwoz_203",
        "turns": [
            {"speaker": "USER", "utterance": "What is my total budget if I travel with 3 people by bus to Vijayawada?"},
            {"speaker": "SYSTEM", "utterance": "AC Sleeper buses cost approximately 750 INR per passenger, total 2250 INR."}
        ],
        "domain": "budget",
        "goal": {"budget": {"transport": "bus", "passengers": 3}}
    }
]

with open(os.path.join(RAW_DIR, "multiwoz", "sample_multiwoz.json"), "w", encoding="utf-8") as f:
    json.dump(multiwoz_samples, f, indent=2)

# TM2 sample format (Task Master 2 spoken conversational dataset)
tm2_samples = [
    {
        "conversation_id": "tm2_301",
        "utterances": [
            {"speaker": "user", "text": "Is tomorrow a good day to travel from Hyderabad to Warangal?"},
            {"speaker": "assistant", "text": "Tomorrow has normal travel traffic, good weather, and low delay risk."},
            {"speaker": "user", "text": "Great! Suggest another alternative route just in case of road works."},
            {"speaker": "assistant", "text": "You can take the NH163 bypass which saves 20 minutes if highway traffic peaks."}
        ],
        "task": "travel_recommendation"
    },
    {
        "conversation_id": "tm2_302",
        "utterances": [
            {"speaker": "user", "text": "Will Manali be crowded during New Year week?"},
            {"speaker": "assistant", "text": "Manali experiences extremely high crowd levels and surge accommodation prices between Dec 28 and Jan 2."}
        ],
        "task": "crowd_inquiry"
    },
    {
        "conversation_id": "tm2_303",
        "utterances": [
            {"speaker": "user", "text": "Is there any national holiday or festival next week?"},
            {"speaker": "assistant", "text": "Yes, next Thursday is a public holiday followed by an extended weekend."}
        ],
        "task": "holiday_inquiry"
    }
]

with open(os.path.join(RAW_DIR, "tm2", "sample_tm2.json"), "w", encoding="utf-8") as f:
    json.dump(tm2_samples, f, indent=2)

# 2. Unified Travel Dialogue Model Generation
# Covering all 21 intents required by Section 12:
intents_data = [
    # travel_search
    ("travel_search", "I want to travel from Hyderabad to Vijayawada next weekend.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "next weekend", "transport_mode": "any", "budget": "moderate", "passengers": 1, "preference": "fastest", "purpose": "leisure"}, "airdialogue"),
    ("travel_search", "Looking for travel options from Bangalore to Goa on 15th November.", {"origin": "Bangalore", "destination": "Goa", "travel_date": "2026-11-15", "transport_mode": "flight", "budget": "any", "passengers": 2, "preference": "comfort", "purpose": "vacation"}, "airdialogue"),
    # route_search
    ("route_search", "Show me the best routes from Hyderabad to Vijayawada.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "", "transport_mode": "car", "budget": "", "passengers": 1, "preference": "fastest", "purpose": ""}, "multiwoz"),
    ("route_search", "Suggest alternative routes from Mumbai to Pune avoiding highway congestion.", {"origin": "Mumbai", "destination": "Pune", "travel_date": "today", "transport_mode": "road", "budget": "", "passengers": 1, "preference": "least crowded", "purpose": "commute"}, "tm2"),
    # trip_planning
    ("trip_planning", "Plan my trip from Hyderabad to Vijayawada on October 20 with hotel and transport.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "return_date": "2026-10-23", "transport_mode": "train", "budget": "5000 INR", "passengers": 2, "preference": "budget", "purpose": "family"}, "multiwoz"),
    ("trip_planning", "Help me plan a 3-day itinerary for Goa starting this Friday.", {"origin": "Bangalore", "destination": "Goa", "travel_date": "this Friday", "return_date": "Sunday", "transport_mode": "flight", "budget": "15000 INR", "passengers": 2, "preference": "sightseeing", "purpose": "holiday"}, "tm2"),
    # holiday_query
    ("holiday_query", "Is there any holiday around my travel date October 20?", {"origin": "", "destination": "", "travel_date": "2026-10-20", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    ("holiday_query", "Check upcoming national holidays and long weekends this month.", {"origin": "", "destination": "", "travel_date": "this month", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    # crowd_prediction
    ("crowd_prediction", "Will Vijayawada be crowded on October 20?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    ("crowd_prediction", "How crowded will Tirupati temple be this Sunday?", {"origin": "Chennai", "destination": "Tirupati", "travel_date": "this Sunday", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "", "purpose": "pilgrimage"}, "multiwoz"),
    # demand_prediction
    ("demand_prediction", "What is the expected travel demand for Hyderabad to Vijayawada next Friday?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "next Friday", "transport_mode": "bus", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    ("demand_prediction", "Will travel demand be high during the festival period?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": "festival"}, "airdialogue"),
    # price_prediction
    ("price_prediction", "Is there a chance of high ticket prices for flights to Delhi next week?", {"origin": "Mumbai", "destination": "Delhi", "travel_date": "next week", "transport_mode": "flight", "budget": "", "passengers": 1, "preference": "economy", "purpose": "business"}, "airdialogue"),
    ("price_prediction", "Will bus fares increase closer to Diwali weekend?", {"origin": "Bangalore", "destination": "Hyderabad", "travel_date": "Diwali weekend", "transport_mode": "bus", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    # delay_prediction
    ("delay_prediction", "Is there a chance of delays traveling from Hyderabad to Vijayawada tomorrow?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "tomorrow", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    ("delay_prediction", "Are flights to Delhi experiencing weather or fog delays?", {"origin": "Bangalore", "destination": "Delhi", "travel_date": "today", "transport_mode": "flight", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    # transport_recommendation
    ("transport_recommendation", "Which transport mode is more suitable between train and bus for Hyderabad to Vijayawada?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "train or bus", "budget": "medium", "passengers": 2, "preference": "punctual", "purpose": ""}, "multiwoz"),
    ("transport_recommendation", "Which transport mode has lower predicted risk for travel to Goa?", {"origin": "Bangalore", "destination": "Goa", "travel_date": "this weekend", "transport_mode": "flight vs train vs bus", "budget": "", "passengers": 1, "preference": "safety", "purpose": ""}, "tm2"),
    # alternative_date
    ("alternative_date", "Should I travel Friday or Saturday to avoid peak rush?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "Friday", "return_date": "Saturday", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "low crowd", "purpose": ""}, "tm2"),
    ("alternative_date", "Find me a cheaper and less crowded travel date around October 20.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "bus", "budget": "low", "passengers": 1, "preference": "low crowd", "purpose": ""}, "airdialogue"),
    # alternative_route
    ("alternative_route", "Suggest another route from Hyderabad to Vijayawada if NH65 has heavy traffic.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "car", "budget": "", "passengers": 1, "preference": "traffic free", "purpose": ""}, "tm2"),
    ("alternative_route", "What alternative routes can I consider for driving to Ooty?", {"origin": "Bangalore", "destination": "Ooty", "travel_date": "Saturday", "transport_mode": "car", "budget": "", "passengers": 2, "preference": "scenic", "purpose": "leisure"}, "tm2"),
    # destination_information
    ("destination_information", "Tell me about tourist attractions and current travel guidelines in Vijayawada.", {"origin": "", "destination": "Vijayawada", "travel_date": "", "transport_mode": "", "budget": "", "passengers": 1, "preference": "sightseeing", "purpose": "tourism"}, "tm2"),
    ("destination_information", "What are the top places to visit in Goa in November?", {"origin": "", "destination": "Goa", "travel_date": "November", "transport_mode": "", "budget": "", "passengers": 1, "preference": "beach", "purpose": "vacation"}, "tm2"),
    # budget_query
    ("budget_query", "What is the estimated budget for 4 people traveling to Tirupati by car?", {"origin": "Hyderabad", "destination": "Tirupati", "travel_date": "next month", "transport_mode": "car", "budget": "", "passengers": 4, "preference": "standard", "purpose": "pilgrimage"}, "multiwoz"),
    ("budget_query", "Can I travel to Jaipur within a budget of 3000 rupees?", {"origin": "Delhi", "destination": "Jaipur", "travel_date": "tomorrow", "transport_mode": "train", "budget": "3000 INR", "passengers": 1, "preference": "economy", "purpose": ""}, "multiwoz"),
    # weather_query
    ("weather_query", "What is the weather forecast for Vijayawada around October 20?", {"origin": "", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    ("weather_query", "Is it raining or foggy along the Mumbai-Pune expressway?", {"origin": "Mumbai", "destination": "Pune", "travel_date": "today", "transport_mode": "car", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    # travel_risk
    ("travel_risk", "Why is my travel risk high for October 20?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    ("travel_risk", "What factors contribute to the overall travel risk score?", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    # booking_query
    ("booking_query", "Check my booking status from Hyderabad to Vijayawada.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-20", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    # booking_change
    ("booking_change", "I want to reschedule my ticket to travel one day earlier.", {"origin": "Hyderabad", "destination": "Vijayawada", "travel_date": "2026-10-19", "transport_mode": "bus", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    # booking_cancel
    ("booking_cancel", "Cancel my travel ticket and process refund.", {"origin": "Delhi", "destination": "Jaipur", "travel_date": "2026-10-25", "transport_mode": "flight", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "airdialogue"),
    # general_travel_question
    ("general_travel_question", "What travel tips do you recommend for first-time train travelers in India?", {"origin": "", "destination": "", "travel_date": "", "transport_mode": "train", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2"),
    # clarification
    ("clarification", "Could you explain what you meant by crowd level VERY HIGH?", {"origin": "", "destination": "", "travel_date": "", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "multiwoz"),
    # unknown
    ("unknown", "What is the capital of France?", {"origin": "", "destination": "", "travel_date": "", "transport_mode": "", "budget": "", "passengers": 1, "preference": "", "purpose": ""}, "tm2")
]

unified_dialogues = []
for idx, (intent, message, slots, source) in enumerate(intents_data, start=1001):
    unified_dialogues.append({
        "dialogue_id": f"ud_{idx}",
        "source": source,
        "user_message": message,
        "intent": intent,
        "slots": slots,
        "dialogue_state": {
            "turn_count": 1,
            "current_step": "user_input",
            "active_intent": intent,
            "extracted_slots": {k: v for k, v in slots.items() if v}
        }
    })

with open(os.path.join(PROCESSED_DIR, "unified_travel_dialogues.json"), "w", encoding="utf-8") as f:
    json.dump(unified_dialogues, f, indent=2)

print(f"Generated {len(unified_dialogues)} unified travel dialogues covering 21 intents.")

# 3. Demo Reference Data: Holidays, Events, Routes, Weather
demo_holidays = [
    {
        "id": "h_1",
        "name": "Dussehra / Vijayadashami",
        "date": "2026-10-20",
        "endDate": "2026-10-21",
        "location": "National / Andhra Pradesh / Telangana",
        "type": "festival",
        "importance": "high",
        "description": "Major festival with heavy regional travel across Vijayawada, Hyderabad and South India."
    },
    {
        "id": "h_2",
        "name": "Diwali / Deepavali",
        "date": "2026-11-08",
        "endDate": "2026-11-10",
        "location": "National",
        "type": "festival",
        "importance": "high",
        "description": "Festival of Lights; nationwide peak travel demand on trains, flights, and interstate highways."
    },
    {
        "id": "h_3",
        "name": "Christmas & Year End Holidays",
        "date": "2026-12-24",
        "endDate": "2027-01-01",
        "location": "National / Goa / Tourist Hubs",
        "type": "holiday",
        "importance": "high",
        "description": "Peak vacation period especially for leisure destinations like Goa, Manali, Kerala."
    },
    {
        "id": "h_4",
        "name": "Sankranti / Pongal",
        "date": "2027-01-14",
        "endDate": "2027-01-17",
        "location": "Andhra Pradesh / Telangana / Tamil Nadu",
        "type": "festival",
        "importance": "high",
        "description": "Massive homecoming exodus from Hyderabad to Vijayawada, Guntur, Rajahmundry, Visakhapatnam."
    },
    {
        "id": "h_5",
        "name": "Republic Day Long Weekend",
        "date": "2027-01-26",
        "endDate": "2027-01-26",
        "location": "National",
        "type": "holiday",
        "importance": "medium",
        "description": "National public holiday creating 3-day weekend leisure travel."
    },
    {
        "id": "h_6",
        "name": "Holi Festival",
        "date": "2027-03-23",
        "endDate": "2027-03-24",
        "location": "National / North India",
        "type": "festival",
        "importance": "medium",
        "description": "Festival of colors with surge demand in northern and central transit corridors."
    }
]

with open(os.path.join(DATA_DIR, "demo_holidays.json"), "w", encoding="utf-8") as f:
    json.dump(demo_holidays, f, indent=2)

demo_events = [
    {
        "id": "e_1",
        "name": "Vijayawada Kanaka Durga Navaratri Utsavalu",
        "date": "2026-10-15",
        "endDate": "2026-10-23",
        "location": "Vijayawada",
        "type": "cultural_religious",
        "importance": "high",
        "crowd_impact": "VERY HIGH",
        "description": "Over 1.5 million pilgrims visit Indrakeeladri temple in Vijayawada during Dussehra."
    },
    {
        "id": "e_2",
        "name": "Goa Sunburn & Winter Carnival",
        "date": "2026-12-27",
        "endDate": "2026-12-31",
        "location": "Goa",
        "type": "music_festival",
        "importance": "high",
        "crowd_impact": "VERY HIGH",
        "description": "Annual electronic music festival drawing over 100,000 visitors, causing hotel & flight price spikes."
    },
    {
        "id": "e_3",
        "name": "Hyderabad Global Tech & IT Expo",
        "date": "2026-11-18",
        "endDate": "2026-11-20",
        "location": "Hyderabad (HITEX)",
        "type": "business_conference",
        "importance": "medium",
        "crowd_impact": "MEDIUM",
        "description": "International conference causing increased business travel and airport traffic."
    }
]

with open(os.path.join(DATA_DIR, "demo_events.json"), "w", encoding="utf-8") as f:
    json.dump(demo_events, f, indent=2)

demo_routes = [
    {
        "route_id": "hyd_vja_1",
        "origin": "Hyderabad",
        "destination": "Vijayawada",
        "route_name": "NH65 Direct Express Highway",
        "distance_km": 274,
        "modes": {
            "train": {"duration_mins": 285, "avg_cost": 350, "transfers": 0, "reliability": 0.92, "delay_risk": "MEDIUM"},
            "bus": {"duration_mins": 360, "avg_cost": 550, "transfers": 0, "reliability": 0.85, "delay_risk": "HIGH"},
            "flight": {"duration_mins": 55, "avg_cost": 2900, "transfers": 0, "reliability": 0.95, "delay_risk": "LOW"},
            "car": {"duration_mins": 310, "avg_cost": 2800, "transfers": 0, "reliability": 0.88, "delay_risk": "MEDIUM"},
            "taxi": {"duration_mins": 310, "avg_cost": 4200, "transfers": 0, "reliability": 0.90, "delay_risk": "MEDIUM"},
            "public_transport": {"duration_mins": 420, "avg_cost": 280, "transfers": 1, "reliability": 0.80, "delay_risk": "HIGH"}
        }
    },
    {
        "route_id": "hyd_vja_2",
        "origin": "Hyderabad",
        "destination": "Vijayawada",
        "route_name": "Via Miryalaguda & Guntur (SH2 Bypass)",
        "distance_km": 298,
        "modes": {
            "car": {"duration_mins": 345, "avg_cost": 3100, "transfers": 0, "reliability": 0.89, "delay_risk": "LOW"},
            "bus": {"duration_mins": 410, "avg_cost": 520, "transfers": 0, "reliability": 0.84, "delay_risk": "MEDIUM"}
        }
    },
    {
        "route_id": "blr_goa_1",
        "origin": "Bangalore",
        "destination": "Goa",
        "route_name": "NH48 via Hubli & Dharwad",
        "distance_km": 560,
        "modes": {
            "flight": {"duration_mins": 70, "avg_cost": 3600, "transfers": 0, "reliability": 0.94, "delay_risk": "LOW"},
            "train": {"duration_mins": 710, "avg_cost": 650, "transfers": 0, "reliability": 0.87, "delay_risk": "MEDIUM"},
            "bus": {"duration_mins": 780, "avg_cost": 1100, "transfers": 0, "reliability": 0.82, "delay_risk": "HIGH"},
            "car": {"duration_mins": 620, "avg_cost": 5400, "transfers": 0, "reliability": 0.86, "delay_risk": "MEDIUM"}
        }
    },
    {
        "route_id": "chn_tpt_1",
        "origin": "Chennai",
        "destination": "Tirupati",
        "route_name": "NH716 Direct Route",
        "distance_km": 135,
        "modes": {
            "train": {"duration_mins": 190, "avg_cost": 160, "transfers": 0, "reliability": 0.94, "delay_risk": "LOW"},
            "bus": {"duration_mins": 240, "avg_cost": 220, "transfers": 0, "reliability": 0.88, "delay_risk": "MEDIUM"},
            "car": {"duration_mins": 210, "avg_cost": 1800, "transfers": 0, "reliability": 0.90, "delay_risk": "LOW"},
            "taxi": {"duration_mins": 210, "avg_cost": 2600, "transfers": 0, "reliability": 0.92, "delay_risk": "LOW"}
        }
    }
]

with open(os.path.join(DATA_DIR, "demo_routes.json"), "w", encoding="utf-8") as f:
    json.dump(demo_routes, f, indent=2)

demo_weather = {
    "Vijayawada": {"condition": "Sunny", "temp_c": 31, "rain_prob": 10, "risk": "LOW"},
    "Hyderabad": {"condition": "Clear", "temp_c": 28, "rain_prob": 15, "risk": "LOW"},
    "Goa": {"condition": "Humid Breeze", "temp_c": 29, "rain_prob": 25, "risk": "LOW"},
    "Tirupati": {"condition": "Partly Cloudy", "temp_c": 30, "rain_prob": 20, "risk": "LOW"},
    "Delhi": {"condition": "Hazy / Foggy", "temp_c": 22, "rain_prob": 5, "risk": "MEDIUM"},
    "Bangalore": {"condition": "Pleasant", "temp_c": 24, "rain_prob": 30, "risk": "LOW"},
    "Mumbai": {"condition": "Scattered Showers", "temp_c": 29, "rain_prob": 65, "risk": "HIGH"}
}

with open(os.path.join(DATA_DIR, "demo_weather.json"), "w", encoding="utf-8") as f:
    json.dump(demo_weather, f, indent=2)

# 4. Generate demo_travel_demand.csv (Simulated / Demo Dataset clearly labeled)
# Fields: date, origin, destination, transport_mode, passengers, historical_demand, holiday, weekend, festival, event, season, weather_condition, average_price, availability, delay_minutes, crowd_level, demand_score

routes_pool = [
    ("Hyderabad", "Vijayawada"),
    ("Vijayawada", "Hyderabad"),
    ("Bangalore", "Goa"),
    ("Chennai", "Tirupati"),
    ("Mumbai", "Pune"),
    ("Delhi", "Jaipur"),
    ("Hyderabad", "Bangalore"),
    ("Bangalore", "Chennai"),
    ("Delhi", "Manali"),
    ("Kolkata", "Puri")
]

transport_modes = ["bus", "train", "flight", "car", "taxi"]
seasons = ["Peak", "Normal", "Off-Peak"]
weather_conditions = ["Clear", "Sunny", "Rain", "Fog", "Thunderstorm"]

start_date = datetime(2026, 1, 1)
records = []
random.seed(42)

# Specific holiday windows for 2026 simulation
known_festivals_2026 = {
    "2026-01-14": "Sankranti", "2026-01-15": "Sankranti", "2026-01-16": "Kanuma",
    "2026-01-26": "Republic Day",
    "2026-03-23": "Holi",
    "2026-04-14": "Vishu/Ambedkar",
    "2026-08-15": "Independence Day",
    "2026-09-14": "Ganesh Chaturthi",
    "2026-10-18": "Navaratri Peak", "2026-10-19": "Maha Navami", "2026-10-20": "Vijayadashami / Dussehra", "2026-10-21": "Dussehra Extended",
    "2026-11-07": "Choti Diwali", "2026-11-08": "Diwali", "2026-11-09": "Govardhan",
    "2026-12-24": "Christmas Eve", "2026-12-25": "Christmas", "2026-12-31": "New Year Eve"
}

for day_offset in range(365):
    cur_date = start_date + timedelta(days=day_offset)
    date_str = cur_date.strftime("%Y-%m-%d")
    is_weekend = 1 if cur_date.weekday() >= 5 else 0
    is_festival = 1 if date_str in known_festivals_2026 else 0
    
    # Proximity check (day before or day after a festival)
    day_before = (cur_date - timedelta(days=1)).strftime("%Y-%m-%d")
    day_after = (cur_date + timedelta(days=1)).strftime("%Y-%m-%d")
    is_holiday_prox = 1 if (is_festival or day_before in known_festivals_2026 or day_after in known_festivals_2026) else 0

    # Month season
    month = cur_date.month
    if month in [10, 11, 12, 1, 5]:
        season = "Peak"
    elif month in [6, 7, 8]:
        season = "Off-Peak"
    else:
        season = "Normal"

    # For each route generate 2-4 daily samples across modes
    for origin, dest in routes_pool:
        # Sample modes
        sample_modes = random.sample(transport_modes, k=3)
        for mode in sample_modes:
            passengers = random.randint(1, 4)
            # Route destination popularity factor
            dest_pop = 1.2 if dest in ["Vijayawada", "Goa", "Tirupati"] else 1.0
            
            # Base historical demand
            hist_demand = random.uniform(40, 75)

            # Weather
            weather = "Clear"
            if month in [6, 7, 8, 9] and random.random() < 0.35:
                weather = "Rain"
            elif month in [12, 1] and origin in ["Delhi"] and random.random() < 0.4:
                weather = "Fog"
            elif random.random() < 0.08:
                weather = "Rain"

            weather_factor = 10 if weather in ["Rain", "Fog", "Thunderstorm"] else 0

            # Calculate grounded multi-factor score
            # Demand Score = Holiday Factor (0-25) + Weekend Factor (0-15) + Season Factor (0-15) + Hist Demand (0-20) + Event Factor (0-15) + Dest Pop (0-10)
            holiday_contrib = 25 if is_festival else (15 if is_holiday_prox else 0)
            weekend_contrib = 15 if is_weekend else 0
            season_contrib = 15 if season == "Peak" else (5 if season == "Normal" else 0)
            event_contrib = 15 if (dest == "Vijayawada" and "10-15" <= date_str[5:] <= "10-23") else (
                15 if (dest == "Goa" and "12-25" <= date_str[5:] <= "12-31") else 0
            )
            hist_contrib = (hist_demand / 75.0) * 20.0
            dest_contrib = 10.0 if dest_pop > 1.1 else 5.0

            raw_score = holiday_contrib + weekend_contrib + season_contrib + event_contrib + hist_contrib + dest_contrib + random.uniform(-4, 4)
            demand_score = max(10.0, min(100.0, raw_score))

            # Determine Crowd Level
            if demand_score >= 80:
                crowd_level = "VERY HIGH"
            elif demand_score >= 65:
                crowd_level = "HIGH"
            elif demand_score >= 45:
                crowd_level = "MEDIUM"
            else:
                crowd_level = "LOW"

            # Determine Average Price and Availability based on mode & demand
            base_price = {"bus": 500, "train": 350, "flight": 3000, "car": 2500, "taxi": 3800}[mode]
            price_multiplier = 1.0 + (demand_score / 100.0) * 0.6
            avg_price = round(base_price * price_multiplier, -1)

            # Availability: 100% down to 10%
            availability = max(5, int(100 - (demand_score * 0.85) + random.randint(-5, 5)))

            # Delay Minutes based on mode, weather, demand
            base_delay = {"bus": 25, "train": 15, "flight": 10, "car": 20, "taxi": 20}[mode]
            delay_minutes = int(base_delay * (1.0 + (demand_score / 100.0)) + (weather_factor * 1.5) + random.randint(-5, 10))
            delay_minutes = max(0, delay_minutes)

            records.append({
                "date": date_str,
                "origin": origin,
                "destination": dest,
                "transport_mode": mode,
                "passengers": passengers,
                "historical_demand": round(hist_demand, 1),
                "holiday": 1 if is_holiday_prox else 0,
                "weekend": is_weekend,
                "festival": is_festival,
                "event": 1 if event_contrib > 0 else 0,
                "season": season,
                "weather_condition": weather,
                "average_price": int(avg_price),
                "availability": availability,
                "delay_minutes": delay_minutes,
                "crowd_level": crowd_level,
                "demand_score": round(demand_score, 1)
            })

# Save to demo_travel_demand.csv and travel_demand.csv
csv_path = os.path.join(DEMAND_DIR, "demo_travel_demand.csv")
main_csv_path = os.path.join(DEMAND_DIR, "travel_demand.csv")

fieldnames = [
    "date", "origin", "destination", "transport_mode", "passengers",
    "historical_demand", "holiday", "weekend", "festival", "event",
    "season", "weather_condition", "average_price", "availability",
    "delay_minutes", "crowd_level", "demand_score"
]

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(records)

with open(main_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(records)

print(f"Generated {len(records)} simulated travel demand records in {csv_path} and {main_csv_path}.")
