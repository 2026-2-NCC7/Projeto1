# Q.I. Tech - Ecossistema Unificado (Portal + Matchmaker Engine)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Q.I. TECH — ECOSSISTEMA UNIFICADO (FECAP 2026)      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Iniciando Backend FastAPI (Porta 8000) e Frontend (Porta 5173)..." -ForegroundColor White

$baseDir = Split-Path -Parent $PSScriptRoot

# 1. Inicia o Backend em processo separado
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\backend'; ..\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Inicia o Frontend unificado
Set-Location "$baseDir\frontend"
npm run dev -- --host 127.0.0.1 --port 5173
