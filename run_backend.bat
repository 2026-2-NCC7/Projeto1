@echo off
title Q.I. Tech Unificado - Backend FastAPI + IA Local
echo ====================================================================
echo   Q.I. Tech - Sistema Unificado (Backend FastAPI + SQLite + IA)
echo   URL da API: http://127.0.0.1:8000
echo   Swagger Docs: http://127.0.0.1:8000/docs
echo ====================================================================
cd /d "%~dp0backend"
if exist "..\venv\Scripts\python.exe" (
    "..\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else if exist "..\..\qi-tech-matchmaker\venv\Scripts\python.exe" (
    "..\..\qi-tech-matchmaker\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause

