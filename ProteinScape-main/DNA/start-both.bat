@echo off
echo Starting GenFlow AI Application...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python first.
    pause
    exit /b 1
)

REM Check if Streamlit is installed
echo Checking Streamlit installation...
python -c "import streamlit; print('OK')" >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    python -m pip install -r requirements.txt --quiet
)

REM Start Streamlit in a new window
echo Starting Streamlit server on http://localhost:8501...
start "Streamlit Server" cmd /k "python -m streamlit run app.py --server.headless true --server.port 8501"

REM Wait a moment for Streamlit to start
timeout /t 3 /nobreak >nul

REM Start React dev server
echo Starting React development server...
echo.
echo ========================================
echo Application URLs:
echo   React App:    http://localhost:5173
echo   Streamlit:    http://localhost:8501
echo ========================================
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start React app
npm run dev

REM Note: Streamlit window will remain open. Close it manually if needed.

