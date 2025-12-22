# PowerShell script to start both React app and Streamlit server

Write-Host "Starting GenFlow AI Application..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "Error: Python not found. Please install Python first." -ForegroundColor Red
    exit 1
}

# Check if Streamlit is installed
Write-Host "Checking Streamlit installation..." -ForegroundColor Yellow
$streamlitCheck = python -c "import streamlit; print('OK')" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
    python -m pip install -r requirements.txt --quiet
}

# Start Streamlit in background
Write-Host "Starting Streamlit server on http://localhost:8501..." -ForegroundColor Green
$streamlitJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    python -m streamlit run app.py --server.headless true --server.port 8501
}

# Wait a moment for Streamlit to start
Start-Sleep -Seconds 3

# Start React dev server
Write-Host "Starting React development server..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application URLs:" -ForegroundColor Cyan
Write-Host "  React App:    http://localhost:5173" -ForegroundColor White
Write-Host "  Streamlit:    http://localhost:8501" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start React app (this will block)
npm run dev

# Cleanup: Stop Streamlit job when React app stops
Stop-Job $streamlitJob
Remove-Job $streamlitJob

