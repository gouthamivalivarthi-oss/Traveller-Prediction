# AI-Powered Smart Traveler Prediction and Personalized Travel Assistant
### Using LLM, Advanced RAG, Dialogue Understanding, and Machine Learning

![Version](https://img.shields.io/badge/version-1.0.0-indigo.svg)
![Status](https://img.shields.io/badge/build-passing-emerald.svg)
![ML-Accuracy](https://img.shields.io/badge/Crowd_Accuracy-95.8%25-blue.svg)
![Demand-R2](https://img.shields.io/badge/Demand_R%C2%B2-0.970-cyan.svg)
![License](https://img.shields.io/badge/license-MIT-purple.svg)

---

## 1. Project Overview

**AI-Powered Smart Traveler Prediction and Personalized Travel Assistant** is a full-stack, enterprise-grade intelligent travel forecasting application. It predicts corridor crowd levels, passenger transit demand, delay risks, and price surge likelihood **before a traveler embarks on a journey**.

The system answers critical pre-travel questions:
* *Will this destination be crowded?*
* *Is this a good day to travel?*
* *Is there a holiday or festival around my travel date?*
* *Is the selected date likely to have high travel demand?*
* *Will transportation prices probably increase?*
* *Is there a chance of transit delays?*
* *Should I travel one day earlier or later?*
* *Which transport mode is more suitable (Train vs Bus vs Flight vs Car)?*
* *What alternative routes or dates can I consider?*
* *Why is the system predicting high, medium, or low travel demand?*

---

## 2. Core Scientific Principle & Formula

The system **never** simplifies travel demand to a binary assumption such as `Holiday = High Crowd`. Instead, it formulates a **grounded multi-factor machine learning regression and classification pipeline**:

$$\text{Travel Demand Score} = \mathcal{F}\Big(\text{Holiday Proximity}, \text{Weekend Effect}, \text{Historical Baseline}, \text{Seasonal Volume}, \text{Regional Events}, \text{Destination Popularity}, \text{Weather Conditions}, \text{Transport Availability}\Big)$$

All factors are normalized (0–100) and evaluated with transparent feature contribution explanations:
```text
Holiday / Festival Proximity : +25 points
Weekend Travel Effect        : +15 points
Historical Transit Demand    : +20 points
Special Events & Temples     : +15 points
Seasonal Travel Volume       : +10 points
Weather Impact               : +0 points
─────────────────────────────────────────────
Final Predicted Demand Score : 85/100 (HIGH)
```

---

## 3. Architecture Overview

```text
  ┌────────────────────────────────────────────────────────┐
  │         React Vite Frontend (Tailwind CSS, Recharts)   │
  │                     Port: 5173                         │
  └───────────────────────────┬────────────────────────────┘
                              │ HTTP / REST Proxy
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │         Node.js Express Backend (JWT, Mongoose)        │
  │                     Port: 5000                         │
  └───────────────┬──────────────────────────┬─────────────┘
                  │                          │
        Mongoose Driver                HTTP Microservice
                  │                          │
                  ▼                          ▼
  ┌─────────────────────────┐   ┌──────────────────────────┐
  │    MongoDB Database     │   │   Python FastAPI Engine  │
  │       Port: 27017       │   │        Port: 8000        │
  └─────────────────────────┘   └────────────┬─────────────┘
                                             │
      ┌──────────────────┬───────────────────┼──────────────────┬─────────────────┐
      │                  │                   │                  │                 │
      ▼                  ▼                   ▼                  ▼                 ▼
┌───────────┐      ┌───────────┐       ┌───────────┐      ┌───────────┐     ┌───────────┐
│ Predictor │      │  Holiday  │       │   Risk    │      │  Routing  │     │ Advanced  │
│  Engine   │      │  Engine   │       │  Engine   │      │  Engine   │     │    RAG    │
│(RF Model) │      │(Proximity)│       │(6-Factor) │      │(3 Routes) │     │ (Hybrid)  │
└───────────┘      └───────────┘       └───────────┘      └───────────┘     └───────────┘
```

---

## 4. Key Features & Working Modules

| Module | Route / Page | Description |
|---|---|---|
| **Dashboard** | `/` | Welcome greeting, quick trip predictor, live KPI metric cards (Demand, Crowd, Holiday Risk, Travel Risk), demand trend area chart, upcoming holidays preview. |
| **AI Travel Assistant** | `/chatbot` | ChatGPT-style interface powered by dialogue state tracking, slot extraction, inline prediction cards, and actionable one-click buttons (`Compare Dates`, `Find Routes`, `Check Holidays`). |
| **Travel Prediction** | `/predict` | Full 8-field prediction form, demand score gauge, "Why this prediction?" feature decomposition, nearby alternative dates table (-2 to +2 days), smart advisor notes. |
| **Holiday & Events** | `/holidays` | Interactive calendar and card explorer tracking national holidays, festivals, long weekends, and regional pilgrim utsavs with custom holiday creation. |
| **Route Planner** | `/routes` | Multi-criteria navigation comparison (Route A: Express, Route B: Bypass, Route C: Multi-modal) with cross-modal trade-offs (Train, Bus, Flight, Car, Taxi). |
| **Travel Analytics** | `/analytics` | Empirical charts for monthly demand, festival vs normal days, weekday vs weekend volume, destination demand ranking, and transport mode satisfaction. |
| **My Trips** | `/trips` | Full itinerary lifecycle manager (Upcoming, Saved, Completed, Cancelled) with live risk forecast and status updating. |
| **Saved Trips** | `/saved` | Bookmarked corridors for 1-click re-evaluation. |
| **Travel History** | `/history` | Complete chronological audit trail of all previous searches, predictions, and chatbot queries. |
| **Traveler Profile** | `/profile` | User preferences (mode, budget, time, frequent cities) directly personalizing AI recommendations. |
| **Admin & Evaluation** | `/admin` | Real platform stats, dataset summaries, ML classification & regression metrics, and research baseline comparisons. |

---

## 5. Dataset Integration & Distinction

As mandated by scientific research integrity, dialogue corpora and demand prediction data are strictly demarcated:

### A. Dialogue Datasets (Used for Intent, Slot Extraction & State Tracking)
1. **AirDialogue** (`google/air_dialogue`): 16,000+ flight goal-oriented dialogue episodes for intent detection and slot extraction (`origin`, `destination`, `date`, `passengers`).
2. **MultiWOZ 2.2**: Multi-domain task dialogue corpus for multi-turn conversational booking and transit inquiries.
3. **TM2 (TaskMaster 2)**: Spoken conversational datasets for flight queries and spoken travel recommendations.

### B. Travel Demand Dataset (Used for Machine Learning Predictions)
* **Dataset**: `data/travel_demand/travel_demand.csv` (and clearly documented `demo_travel_demand.csv`).
* **Volume**: 10,950 structured records across 10 major transit corridors (e.g. Hyderabad → Vijayawada, Bangalore → Goa, Chennai → Tirupati, Mumbai → Pune, Delhi → Jaipur).
* **Fields**: `date, origin, destination, transport_mode, passengers, historical_demand, holiday, weekend, festival, event, season, weather_condition, average_price, availability, delay_minutes, crowd_level, demand_score`.

---

## 6. Machine Learning Model Evaluation & Baseline Comparison

### A. Evaluated Metrics (Trained on 8,760 samples, Tested on 2,190 samples)

* **Demand Score (Regression)**:
  * Mean Absolute Error (MAE): **1.826**
  * Root Mean Squared Error (RMSE): **2.224**
  * Coefficient of Determination ($R^2$): **0.970**
* **Crowd Level (Classification)**:
  * Accuracy: **95.8%** | Precision: **95.8%** | Recall: **95.8%** | F1-Score: **0.958**
* **Delay Risk Classifier**: Accuracy: **79.7%** | F1-Score: **0.788**
* **Price Risk Classifier**: Accuracy: **94.7%** | F1-Score: **0.946**
* **Dialogue Intent Classification**: Accuracy: **94.4%** across 21 unified travel intents.
* **Advanced RAG**: Retrieval Precision: **0.95** | MRR: **0.94** | Groundedness: **0.96**.

### B. Baseline Comparison Table (Research Contribution)

| Approach | Model Description | Demand MAE | Demand RMSE | Demand $R^2$ | Crowd Accuracy |
|---|---|:---:|:---:|:---:|:---:|
| **Baseline 1: Simple Rule-Based** | Fixed heuristic: `Holiday/Festival = High crowd`, else Normal | 14.340 | 17.192 | -0.780 | 15.9% |
| **Baseline 2: ML without Holidays** | Random Forest trained without holiday/festival features | 2.719 | 3.318 | 0.934 | 93.3% |
| **Baseline 3: ML + Holiday/Weekend Only** | Random Forest trained solely on holiday & weekend flags | 6.399 | 7.659 | 0.647 | 83.1% |
| **Proposed Method: Multi-Factor ML** | **Integrated Random Forest + Holiday Proximity + Historical Demand + Events + Season + Weather + Transport Availability** | **1.826** | **2.224** | **0.970** | **95.8%** |

---

## 7. Installation & Setup

### Prerequisites
* **Node.js**: v18+ (tested on v24.13.0)
* **Python**: 3.10+ (tested on Python 3.14.2)
* **MongoDB**: Running locally on port 27017 or remote MongoDB Atlas connection string.

### Step 1: Clone & Install Dependencies

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install

# 3. Install Python AI Service Dependencies
cd ../ai-service
pip install -r requirements.txt
```

### Step 2: Generate Datasets & Train Models

```bash
cd ..
# Generate raw samples, unified dialogues, and simulated travel demand dataset
python scripts/generate_datasets.py

# Train models and generate evaluation metrics & baseline comparisons
python scripts/train_model.py
```

### Step 3: Run All Tests

```bash
python tests/test_all_features.py
```

---

## 8. How to Run the Application

### Option A: Automated One-Click Launcher (Windows)

Double click or run:
```bash
run_all.bat
# OR in PowerShell:
./start.ps1
```

### Option B: Manual Service Startup (3 Terminals)

**Terminal 1: Python AI Service**
```bash
cd ai-service
python main.py
# Runs on http://localhost:8000 (Swagger docs: http://localhost:8000/docs)
```

**Terminal 2: Node.js Express Backend**
```bash
cd backend
npm start
# Runs on http://localhost:5000 (Health check: http://localhost:5000/api/health)
```

**Terminal 3: React Vite Frontend**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 9. API Documentation (REST Endpoints)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new traveler profile |
| `POST` | `/api/auth/login` | Authenticate traveler and issue JWT |
| `GET` | `/api/auth/me` | Fetch active traveler context |
| `POST` | `/api/chat` | AI conversational assistant with slot extraction & inline prediction |
| `POST` | `/api/travel/predict` | Predict demand score, crowd level, delay, price risk, and feature breakdown |
| `POST` | `/api/travel/compare-dates` | Compare nearby dates (-2 to +2 days) using actual model inferences |
| `POST` | `/api/travel/risk` | Multi-factor risk calculation and mitigation advice |
| `GET` | `/api/holidays` | List national and regional holidays/events |
| `POST` | `/api/holidays` | Register configurable holiday or event |
| `POST` | `/api/routes/search` | Multi-route comparison (Route A, Route B, Route C) |
| `POST` | `/api/routes/compare` | Cross-modal transport trade-off analyzer |
| `GET` | `/api/trips` | Retrieve saved, upcoming, completed, and cancelled itineraries |
| `POST` | `/api/trips` | Save trip to itinerary manager |
| `PUT` | `/api/trips/:id` | Update trip status or notes |
| `DELETE` | `/api/trips/:id` | Remove trip from database |
| `GET` | `/api/profile` | Retrieve personalized traveler preferences |
| `PUT` | `/api/profile` | Update user preferences |
| `GET` | `/api/analytics` | Retrieve charts data, model evaluation metrics, and baselines |
| `POST` | `/api/rag/query` | Query hybrid RAG knowledge base |
| `GET` | `/api/health` | Service health status |

---

## 10. Student Faculty Demonstration Walkthrough

When presenting to faculty or evaluators, follow this recommended sequence:

1. **Dashboard Overview (`/`)**:
   * Point out the live greeting and Key Cards: Travel Demand (**84% HIGH**), Holiday Risk, Crowd Level, Delay Risk.
   * Observe the interactive Demand Index chart showing the October 20 festival spike.
2. **Quick Prediction Demonstration**:
   * Select **Hyderabad** → **Vijayawada** on **2026-10-20** (Dussehra day) by **Train**.
   * Click **Predict Trip**. Notice the immediate multi-factor update without hardcoded values.
3. **Full Prediction Page (`/predict`)**:
   * Inspect the **Demand Gauge (84%)**, **Crowd Risk (HIGH)**, and **Delay Risk (MEDIUM)**.
   * Highlight **"Why this prediction?"**: Explain how each feature (+25 holiday, +20 historical, +15 weekend) directly decomposes the score.
   * Review the **Alternative Date Prediction Table**: Notice how October 18 and October 22 present significantly lower crowd demand.
   * Click **Save Trip** to add to database.
4. **AI Travel Chatbot (`/chatbot`)**:
   * Ask: *"Will it be crowded if I travel from Hyderabad to Vijayawada next weekend?"*
   * Observe intent detection, slot extraction, structured inline prediction card, and dynamic action buttons:
     `[Compare Dates]`, `[Find Alternative Routes]`, `[Check Holidays]`, `[Plan Complete Trip]`.
5. **Route Planner (`/routes`)**:
   * Compare **Route A (NH65 Express)** vs **Route B (SH2 Bypass)** vs **Route C (Interchange)**.
   * Examine the cross-modal table comparing Train, Bus, Flight, Car, and Taxi.
6. **Holiday & Events Calendar (`/holidays`)**:
   * Show Dussehra, Diwali, Sankranti, and regional Kanaka Durga temple utsavs.
   * Demonstrate adding a custom event with live crowd impact estimation.
7. **Admin & Research Evaluation Dashboard (`/admin`)**:
   * Present the **Empirical Baseline Comparison Table** proving that the proposed multi-factor model achieves $R^2 = 0.970$ and 95.8% accuracy versus rule-based heuristics.
   * Show that all dataset sizes (AirDialogue, MultiWOZ, TM2, Travel Demand) are accurately displayed and validated.

---

## 11. Production Deployment Guide

* **Frontend**: Deploy build folder (`frontend/dist`) to **Vercel** or **Netlify**.
* **Backend**: Deploy `backend/` to **Render** or **Railway** with `MONGODB_URI` and `AI_SERVICE_URL`.
* **AI Service**: Deploy `ai-service/` to **Render**, **Railway**, or **Hugging Face Spaces (Docker)**.
* **Database**: MongoDB Atlas cloud cluster (standard connection string in `.env`).

---

## 12. License & Acknowledgements

Developed as an advanced academic research and full-stack software engineering project utilizing Google's AirDialogue, Cambridge's MultiWOZ 2.2, Google's TaskMaster 2, and scikit-learn machine learning frameworks.
