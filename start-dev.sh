#!/usr/bin/env bash
# DREAMFRAME Dev Server Launcher
# Usage: ./start-dev.sh

set -e

echo ""
echo "██████╗ ██████╗ ███████╗███████╗███████╗██████╗ "
echo "██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗"
echo "██║   ██║██████╔╝█████╗  ███████╗█████╗  ██████╔╝"
echo "██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══╝  ██╔══██╗"
echo "╚██████╔╝██║  ██║███████╗███████║███████╗██║  ██║"
echo " ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝"
echo ""
echo "Starting DREAMFRAME development server..."
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting Vite dev server on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open launcher in background (macOS/Linux)
if command -v open &> /dev/null; then
    open launch.html
elif command -v xdg-open &> /dev/null; then
    xdg-open launch.html
fi

# Start dev server
npm run dev