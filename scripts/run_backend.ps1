# Q.I. Tech Matchmaker Engine - Run Backend (FastAPI + Uvicorn)
Write-Host "Iniciando FastAPI Backend em http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\backend"
..\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
