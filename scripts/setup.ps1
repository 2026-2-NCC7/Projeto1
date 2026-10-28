# Q.I. Tech Matchmaker Engine - Setup Script (Windows PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Q.I. Tech Matchmaker Engine - Setup do Ambiente Local" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verifica Python
Write-Host "`n[1/5] Verificando versão do Python..." -ForegroundColor Yellow
$pythonVersion = python --version
Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green

# 2. Cria venv se não existir
if (-not (Test-Path ".\venv")) {
    Write-Host "`n[2/5] Criando ambiente virtual Python (venv)..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Ambiente virtual criado em .\venv" -ForegroundColor Green
} else {
    Write-Host "`n[2/5] Ambiente virtual .\venv já existe." -ForegroundColor Green
}

# 3. Instala dependências do backend
Write-Host "`n[3/5] Instalando dependências do backend..." -ForegroundColor Yellow
.\venv\Scripts\python -m pip install --upgrade pip
.\venv\Scripts\pip install -r .\backend\requirements.txt

# 4. Instala dependências do frontend
Write-Host "`n[4/5] Instalando dependências do frontend (npm)..." -ForegroundColor Yellow
Set-Location .\frontend
npm install
Set-Location ..

# 5. Inicializa e popula o banco de dados
Write-Host "`n[5/5] Inicializando banco de dados e populando dados de demonstração..." -ForegroundColor Yellow
Set-Location .\backend
..\venv\Scripts\python -m app.seeds.run_seed
Set-Location ..

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "  Para iniciar o backend:  .\scripts\run_backend.ps1" -ForegroundColor Cyan
Write-Host "  Para iniciar o frontend: .\scripts\run_frontend.ps1" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
