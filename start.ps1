# PowerShell Startup Script for Smart Traveler Prediction System

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  AI-POWERED SMART TRAVELER PREDICTION & ASSISTANT SYSTEM" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$scriptRoot = $PSScriptRoot

Write-Host "`n[1/3] Starting Python FastAPI AI Service on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot/ai-service'; python main.py"

Start-Sleep -Seconds 3

Write-Host "[2/3] Starting Node.js Express Backend on port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot/backend'; npm start"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting React Vite Frontend on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot/frontend'; npm run dev"

Write-Host "`nAll services successfully launched!" -ForegroundColor Yellow
Write-Host "  Frontend Web UI:   http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API:       http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  Python AI Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan
