# Q.I. Tech Matchmaker Engine - Run Frontend (Vite + React)
Write-Host "Iniciando Vite React Frontend em http://127.0.0.1:5173 ..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\frontend"
npm run dev -- --host 127.0.0.1 --port 5173
