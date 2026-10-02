"""
FastAPI AI Service for Smart Traveler Prediction and Travel Assistant
Port: 8000
"""

import os
import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from prediction.predictor import TravelPredictor
from prediction.alternative_dates import AlternativeDateAdvisor
from routing.route_engine import RouteEngine
from rag.rag_pipeline import AdvancedRAGPipeline
from chatbot.travel_chatbot import TravelChatbot

app = FastAPI(
    title="Smart Traveler AI Service",
    description="AI Service for travel prediction, RAG, route planning, holiday intelligence, and conversational assistance.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
print("Initializing AI Service components...")
predictor = TravelPredictor()
alternative_dates_advisor = AlternativeDateAdvisor(predictor)
route_engine = RouteEngine(predictor)
rag_pipeline = AdvancedRAGPipeline()
chatbot = TravelChatbot(predictor, rag_pipeline)
print("All AI Service components initialized successfully!")

# Request Models
class PredictRequest(BaseModel):
    origin: str = Field(..., example="Hyderabad")
    destination: str = Field(..., example="Vijayawada")
    travel_date: str = Field(..., example="2026-10-20")
    return_date: Optional[str] = Field(None, example="2026-10-23")
    transport_mode: str = Field("train", example="train")
    passengers: int = Field(1, example=1)
    budget: Optional[str] = None
    purpose: Optional[str] = None
    user_preference: Optional[str] = None

class CompareDatesRequest(BaseModel):
    origin: str = Field(..., example="Hyderabad")
    destination: str = Field(..., example="Vijayawada")
    target_date: str = Field(..., example="2026-10-20")
    transport_mode: str = Field("train", example="train")
    passengers: int = Field(1, example=1)
    day_range: int = Field(2, example=2)

class RiskRequest(BaseModel):
    crowd_level: str = "HIGH"
    delay_risk: str = "MEDIUM"
    holiday_factor: float = 0.85
    price_risk: str = "MEDIUM"
    weather_condition: str = "Clear"
    availability_pct: int = 40

class ChatRequest(BaseModel):
    message: str = Field(..., example="Will it be crowded if I travel from Hyderabad to Vijayawada next weekend?")
    history: Optional[List[Dict[str, str]]] = None
    user_profile: Optional[Dict[str, Any]] = None

class RouteSearchRequest(BaseModel):
    origin: str = "Hyderabad"
    destination: str = "Vijayawada"
    travel_date: str = "2026-10-20"
    departure_time: str = "08:00"
    transport_mode: str = "train"
    priority: str = "Balanced"

class TransportCompareRequest(BaseModel):
    origin: str = "Hyderabad"
    destination: str = "Vijayawada"
    travel_date: str = "2026-10-20"

class RAGQueryRequest(BaseModel):
    query: str
    context_prediction: Optional[Dict[str, Any]] = None

class HolidayCreateRequest(BaseModel):
    name: str
    date: str
    endDate: Optional[str] = None
    location: str = "National"
    type: str = "holiday"
    importance: str = "high"
    description: Optional[str] = ""

# API Endpoints
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "smart-traveler-ai-service",
        "version": "1.0.0",
        "models_loaded": True,
        "demo_mode": True
    }

@app.post("/predict")
def predict_trip(req: PredictRequest):
    try:
        res = predictor.predict(
            origin=req.origin,
            destination=req.destination,
            travel_date=req.travel_date,
            return_date=req.return_date,
            transport_mode=req.transport_mode,
            passengers=req.passengers,
            budget=req.budget,
            purpose=req.purpose,
            user_preference=req.user_preference
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare-dates")
def compare_dates(req: CompareDatesRequest):
    try:
        res = alternative_dates_advisor.compare_dates(
            origin=req.origin,
            destination=req.destination,
            target_date=req.target_date,
            transport_mode=req.transport_mode,
            passengers=req.passengers,
            day_range=req.day_range
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/risk")
def calculate_risk(req: RiskRequest):
    try:
        res = predictor.risk_engine.calculate_risk(
            crowd_level=req.crowd_level,
            delay_risk=req.delay_risk,
            holiday_factor=req.holiday_factor,
            price_risk=req.price_risk,
            weather_condition=req.weather_condition,
            availability_pct=req.availability_pct
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_assistant(req: ChatRequest):
    try:
        res = chatbot.process_message(
            user_message=req.message,
            chat_history=req.history,
            user_profile=req.user_profile
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/routes/search")
def search_routes(req: RouteSearchRequest):
    try:
        res = route_engine.plan_routes(
            origin=req.origin,
            destination=req.destination,
            travel_date=req.travel_date,
            departure_time=req.departure_time,
            preferred_mode=req.transport_mode,
            priority=req.priority
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/routes/compare")
def compare_transports(req: TransportCompareRequest):
    try:
        res = route_engine.compare_transport_modes(
            origin=req.origin,
            destination=req.destination,
            travel_date=req.travel_date
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/holidays")
def list_holidays():
    return {
        "holidays": predictor.holiday_engine.get_all_holidays(),
        "events": predictor.holiday_engine.get_all_events()
    }

@app.post("/holidays")
def add_holiday(h: HolidayCreateRequest):
    h_dict = h.dict()
    predictor.holiday_engine.add_holiday(h_dict)
    return {"message": "Holiday registered successfully", "holiday": h_dict}

@app.post("/rag/query")
def rag_search(req: RAGQueryRequest):
    try:
        res = rag_pipeline.answer_query(req.query, req.context_prediction)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/evaluation/metrics")
def get_evaluation_metrics():
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    metrics_path = os.path.join(base, "models", "metrics.json")
    baselines_path = os.path.join(base, "models", "baseline_comparison.json")

    metrics_data = {}
    baselines_data = {}

    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
    if os.path.exists(baselines_path):
        with open(baselines_path, "r", encoding="utf-8") as f:
            baselines_data = json.load(f)

    return {
        "metrics": metrics_data,
        "baselines": baselines_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
