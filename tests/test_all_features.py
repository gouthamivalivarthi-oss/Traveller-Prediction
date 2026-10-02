"""
Comprehensive Test Suite for Smart Traveler Prediction System
Tests:
1. Holiday & Event Engine
2. ML Prediction Models (Demand, Crowd, Delay, Price)
3. Feature Contribution Explanation
4. Alternative Date Comparison
5. Multi-Route Engine & Transport Trade-Offs
6. Advanced RAG Retrieval & Verification
7. AI Chatbot Dialogue Understanding on Required Test Queries:
   - "Will it be crowded if I travel tomorrow?"
   - "Is there a holiday next weekend?"
   - "Should I travel on Friday or Saturday?"
   - "Will travel demand be high during the festival?"
   - "Find a less crowded travel date."
   - "Why is my trip risk high?"
   - "Suggest an alternative route."
   - "Plan my trip from Hyderabad to Vijayawada."
   - "Which transport mode has lower predicted risk?"
8. Baseline Comparison Results
"""

import sys
import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "ai-service"))

from prediction.predictor import TravelPredictor
from prediction.alternative_dates import AlternativeDateAdvisor
from routing.route_engine import RouteEngine
from rag.rag_pipeline import AdvancedRAGPipeline
from chatbot.travel_chatbot import TravelChatbot

def run_tests():
    print("=" * 60)
    print("RUNNING COMPREHENSIVE AI TRAVELER TEST SUITE")
    print("=" * 60)

    # 1. Initialize Components
    predictor = TravelPredictor()
    advisor = AlternativeDateAdvisor(predictor)
    router = RouteEngine(predictor)
    rag = AdvancedRAGPipeline()
    bot = TravelChatbot(predictor, rag)
    print("[PASS] Initialized all AI Service components successfully.\n")

    # 2. Test Prediction Engine
    print("--- Test 1: Trip Prediction (Hyderabad -> Vijayawada on Oct 20) ---")
    pred = predictor.predict(
        origin="Hyderabad",
        destination="Vijayawada",
        travel_date="2026-10-20",
        transport_mode="train",
        passengers=2
    )
    assert "demand_score" in pred, "demand_score missing"
    assert pred["demand_score"] > 60, "Expected high demand during Dussehra"
    assert pred["crowd_level"] in ["HIGH", "VERY HIGH"], f"Unexpected crowd level: {pred['crowd_level']}"
    assert "contributions" in pred["explanation"], "Explanations missing"
    print(f"Demand Score: {pred['demand_score']}/100, Crowd Level: {pred['crowd_level']}")
    print(f"Delay Risk: {pred['delay_risk']}, Price Risk: {pred['price_risk']}")
    print("[PASS] Trip prediction & explanation verified.\n")

    # 3. Test Alternative Dates Advisor
    print("--- Test 2: Alternative Date Comparison (-2 to +2 Days) ---")
    alt = advisor.compare_dates("Hyderabad", "Vijayawada", "2026-10-20")
    assert len(alt["comparisons"]) == 5, f"Expected 5 comparison dates, got {len(alt['comparisons'])}"
    print(f"Selected Date: {alt['selected_date']}, Recommended Window: {alt['best_recommended_date']}")
    for c in alt["comparisons"]:
        print(f"  • {c['date']}: Demand {c['demand_score']}%, Crowd {c['crowd_level']}, Delay {c['delay_risk']}")
    print("[PASS] Alternative date comparison verified.\n")

    # 4. Test Multi-Route & Transport Mode Comparisons
    print("--- Test 3: Route Planning & Modal Trade-Offs ---")
    routes_res = router.plan_routes("Hyderabad", "Vijayawada", "2026-10-20", priority="Balanced")
    assert len(routes_res["routes"]) == 3, "Expected 3 route options (Route A, Route B, Route C)"
    print(f"Route A: {routes_res['routes'][0]['name']} ({routes_res['routes'][0]['duration']})")
    print(f"Route B: {routes_res['routes'][1]['name']} ({routes_res['routes'][1]['duration']})")
    print(f"Route C: {routes_res['routes'][2]['name']} ({routes_res['routes'][2]['duration']})")

    modal = router.compare_transport_modes("Hyderabad", "Vijayawada", "2026-10-20")
    assert len(modal["modes_comparison"]) >= 5, "Expected 5+ transport modes"
    print("[PASS] Route planning & modal trade-offs verified.\n")

    # 5. Test RAG Pipeline
    print("--- Test 4: Advanced RAG Knowledge Retrieval ---")
    rag_res = rag.answer_query("What is the peak travel rush between Hyderabad and Vijayawada during Dussehra?")
    assert rag_res["evidence_verified"] == True, "Evidence verification failed"
    print(f"Retrieved docs count: {len(rag_res['retrieved_documents'])}, Confidence: {rag_res['confidence_score']}")
    print("[PASS] Advanced RAG verified.\n")

    # 6. Test All User-Specified Test Queries on AI Chatbot (Section 43)
    print("--- Test 5: Section 43 Required Test Queries ---")
    test_queries = [
        "Will it be crowded if I travel tomorrow?",
        "Is there a holiday next weekend?",
        "Should I travel on Friday or Saturday?",
        "Will travel demand be high during the festival?",
        "Find a less crowded travel date.",
        "Why is my trip risk high?",
        "Suggest an alternative route.",
        "Plan my trip from Hyderabad to Vijayawada.",
        "Which transport mode has lower predicted risk?"
    ]

    for q in test_queries:
        res = bot.process_message(q)
        assert res["response"], f"Empty response for query: {q}"
        assert len(res["action_buttons"]) > 0, f"Action buttons missing for: {q}"
        print(f"Query: '{q}' -> Intent: [{res['intent']}], Buttons: {res['action_buttons'][:2]}")
    print("[PASS] All Section 43 conversational queries handled successfully.\n")

    # 7. Verify Saved Baselines and Metrics
    print("--- Test 6: Verify Baselines & Evaluation Metrics Artifacts ---")
    metrics_file = os.path.join(BASE_DIR, "models", "metrics.json")
    baselines_file = os.path.join(BASE_DIR, "models", "baseline_comparison.json")
    assert os.path.exists(metrics_file), "metrics.json missing"
    assert os.path.exists(baselines_file), "baseline_comparison.json missing"

    with open(baselines_file, "r") as f:
        baselines = json.load(f)
    assert "Proposed: Multi-Factor Integrated ML" in baselines
    assert "Baseline 1: Simple Rule-Based" in baselines
    print("[PASS] Baseline metrics artifacts verified.")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
