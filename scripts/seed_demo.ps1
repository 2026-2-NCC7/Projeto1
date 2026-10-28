# Q.I. Tech Matchmaker Engine - Seed Demo Data Script
Write-Host "Recarregando dados de demonstração (5 candidatos, 3 vagas, cenários A a G)..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\backend"
..\venv\Scripts\python -m app.seeds.run_seed
Write-Host "Seed concluído com sucesso!" -ForegroundColor Green
