#!/bin/bash

# Script to start both the frontend and backend servers

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if required commands exist
if ! command_exists python; then
  echo "Error: Python is not installed. Please install Python 3.8 or later."
  exit 1
fi

if ! command_exists npm; then
  echo "Error: npm is not installed. Please install Node.js and npm."
  exit 1
fi

# Start the backend server
echo "Starting the backend server..."
cd experimental/ai-mental-health/backend || { echo "Error: Backend directory not found"; exit 1; }

# Check if required Python packages are installed
echo "Checking Python dependencies..."
python -c "import fastapi, uvicorn" 2>/dev/null || {
  echo "Installing required Python packages..."
  pip install fastapi uvicorn sqlalchemy pydantic-settings httpx python-jose[cryptography] passlib
}

# Start the backend server in the background
python -m uvicorn app.main:app --reload &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Start the frontend server
echo "Starting the frontend server..."
cd ../../frontend || { echo "Error: Frontend directory not found"; exit 1; }

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start the frontend server
npm start &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID $FRONTEND_PID
  exit 0
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

echo "Both servers are running. Press Ctrl+C to stop."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Backend API docs: http://localhost:8000/docs"

# Keep the script running
wait
