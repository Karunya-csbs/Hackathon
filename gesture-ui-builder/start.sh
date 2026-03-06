#!/bin/bash
# Quick Start Script for Gesture UI Builder
# Runs both frontend and backend in development mode

set -e  # Exit on error

echo "🚀 Starting Gesture UI Builder..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Check if PostgreSQL is running
if ! psql -U postgres -c "SELECT version();" &> /dev/null; then
    echo "⚠️  PostgreSQL not detected. Make sure it's running:"
    echo "   macOS: brew services start postgresql"
    echo "   Linux: sudo systemctl start postgresql"
    echo "   Windows: Service should auto-start"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r; echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✓ PostgreSQL detected"

# Setup Backend
echo ""
echo "📦 Setting up backend..."
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update server/.env with your database credentials"
fi

# Check if database needs setup
if ! psql -U postgres -d gesture_ui_builder -c "SELECT * FROM \"User\" LIMIT 1;" &> /dev/null; then
    echo "Initializing database..."
    npm run prisma:generate
    npm run prisma:migrate
    echo "✓ Database initialized"
fi

echo "✓ Backend ready"

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."
cd ../client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "✓ Frontend ready"

# Start servers
echo ""
echo "🎯 Starting servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd ../server
npm run dev &
BACKEND_PID=$!

# Start frontend
cd ../client
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
