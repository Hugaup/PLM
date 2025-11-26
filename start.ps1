# AirPlus Dashboard Launcher
# Starts both Streamlit and FastAPI servers

Write-Host "🚀 Starting AirPlus Process Mining Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Start FastAPI server in background
Write-Host "📡 Starting FastAPI server on port 8502..." -ForegroundColor Yellow
$fastapi = Start-Process powershell -ArgumentList "-NoExit", "-Command", "uv run uvicorn api_server:app --host 0.0.0.0 --port 8502 --reload" -PassThru
Start-Sleep -Seconds 2

# Start Streamlit server
Write-Host "🎨 Starting Streamlit dashboard on port 8501..." -ForegroundColor Green
Write-Host ""
uv run streamlit run streamlit_app.py

# Cleanup on exit
Write-Host ""
Write-Host "🛑 Stopping servers..." -ForegroundColor Red
Stop-Process -Id $fastapi.Id -Force
Write-Host "✅ All servers stopped." -ForegroundColor Green
