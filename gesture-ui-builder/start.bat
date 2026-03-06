@echo off
REM Quick Start Script for Gesture UI Builder (Windows)
REM Runs both frontend and backend in development mode

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Gesture UI Builder...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%A in ('node --version') do set NODE_VERSION=%%A
echo ✓ Node.js %NODE_VERSION% detected

REM Setup Backend
echo.
echo 📦 Setting up backend...
cd server

if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo ⚠️  Please update server\.env with your database credentials
    pause
)

echo ✓ Backend ready

REM Setup Frontend
echo.
echo 📦 Setting up frontend...
cd ..\client

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

echo ✓ Frontend ready

REM Start servers
echo.
echo 🎯 Starting servers...
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo Starting in two windows...
echo.

REM Start backend
start "Gesture UI Backend" cmd /k cd /d "%CD%\..\server" ^& npm run dev

REM Start frontend
timeout /t 3 /nobreak
cd client
npm run dev
