@echo off
title DREAMFRAME Dev Server
color 0A

echo.
echo  ██████╗ ██████╗ ███████╗███████╗███████╗██████╗ 
echo ██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗
echo ██║   ██║██████╔╝█████╗  ███████╗█████╗  ██████╔╝
echo ██║   ██║██╔══██╗██╔══╝  ╚════██║██╔══╝  ██╔══██╗
echo ╚██████╔╝██║  ██║███████╗███████║███████╗██║  ██║
echo  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
echo.
echo  Starting DREAMFRAME development server...
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting Vite dev server on http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start dev server and open launcher
start "" "launch.html"
npm run dev