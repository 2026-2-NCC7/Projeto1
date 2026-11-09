@echo off
cd /d "%~dp0"
title Q.I. Match - Inicializador do Ecossistema Unificado
echo Iniciando Backend FastAPI (porta 8000) e Frontend React (porta 5173)...
start "Q.I. Match Backend (FastAPI)" cmd /k call run_backend.bat
start "Q.I. Match Frontend (Vite)" cmd /k call run_frontend.bat
echo Os dois servicos foram iniciados!
echo Acesse no navegador: http://127.0.0.1:5173
