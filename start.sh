#!/bin/sh
set -e

echo "============================================================"
echo " Starting Smart Traveler Prediction Full-Stack on Render    "
echo "============================================================"

# Ensure PORT is defined (Render assigns this dynamically)
export PORT="${PORT:-10000}"
export AI_SERVICE_URL="http://127.0.0.1:8000"
export NODE_ENV="production"

# 1. Start Python FastAPI AI Service in background
echo "[1/2] Starting Python FastAPI AI Service on 127.0.0.1:8000..."
cd /app/ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 &

# 2. Wait for AI Service to become ready
echo "Checking AI Service health..."
for i in $(seq 1 20); do
    if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "AI Service is healthy and ready!"
        break
    fi
    sleep 1
done

# 3. Start Node.js Express Backend on Render's $PORT (serves API & 3D React Frontend)
echo "[2/2] Starting Node.js Express Backend on port ${PORT}..."
cd /app/backend
exec node src/server.js
