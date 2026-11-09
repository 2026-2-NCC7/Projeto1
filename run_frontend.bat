@echo off
title Q.I. Match Unificado - Frontend React + Vite
echo ====================================================================
echo   Q.I. Match - Sistema Unificado (Frontend Candidato/Empresa/Admin)
echo   URL da Interface: http://127.0.0.1:5173
echo ====================================================================
cd /d "%~dp0"
npm run dev -- --host 127.0.0.1 --port 5173
pause

