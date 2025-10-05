@echo off
REM JoinAGame - Project Startup Script for Windows
REM This script helps users quickly set up and start the project

echo 🚀 Starting JoinAGame project setup...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd my-app
npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ All dependencies installed successfully!

REM Start backend server in background
echo 🖥️  Starting backend server...
start "Backend Server" cmd /k "npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🌐 Starting frontend server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🎉 JoinAGame is now running!
echo 📱 Frontend: http://localhost:5173
echo 🖥️  Backend: http://localhost:3001
echo.
echo Close the terminal windows to stop the servers
pause
