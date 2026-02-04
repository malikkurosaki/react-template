#!/bin/bash
# Kill all dev servers

echo "🛑 Stopping dev servers..."

# Kill by port
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null

# Kill by process name
pkill -9 -f "vite|concurrently" 2>/dev/null
pkill -9 -f "bun.*dev|bun.*hot" 2>/dev/null

sleep 1

echo "✅ All dev servers stopped!"
echo ""
echo "To restart: bun dev"
