#!/bin/bash

# JoinAGame - Project Startup Script
# This script helps users quickly set up and start the project

echo "🚀 Starting JoinAGame project setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd my-app
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ All dependencies installed successfully!"

# Start backend server in background
echo "🖥️  Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 JoinAGame is now running!"
echo "📱 Frontend: http://localhost:5173"
echo "🖥️  Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
