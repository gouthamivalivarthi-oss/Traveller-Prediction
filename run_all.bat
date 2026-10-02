@echo off
echo ======================================================================
echo   AI-POWERED SMART TRAVELER PREDICTION & ASSISTANT SYSTEM
echo ======================================================================
echo.

echo [1/3] Starting Python FastAPI AI Service on port 8000...
start "AI Service (FastAPI :8000)" cmd /k "cd /d "%~dp0ai-service" && python main.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Node.js Express Backend on port 5000...
start "Backend (Express :5000)" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Vite Frontend on port 5173...
start "Frontend (Vite :5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All services launched!
echo Access Web Dashboard at: http://localhost:5173
echo Backend API Health at:   http://localhost:5000/api/health
echo Python AI Swagger at:   http://localhost:8000/docs
echo ======================================================================
pause
