@echo off
title AnimeLogger Setup

echo.
echo ===============================
echo    Welcome to AnimeLogger Setup!
echo ===============================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
) else (
    echo [OK] npm is installed
)

echo.
echo Setting up AnimeLogger...
echo.

REM Install dependencies
echo Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
) else (
    echo [OK] Dependencies installed successfully
)

echo.
echo Setting up environment configuration...

REM Setup environment file
if not exist .env.local (
    copy .env.example .env.local >nul
    echo [OK] Created .env.local file
    echo.
    echo [WARNING] Please edit .env.local and add your Google AI API key
    echo.
    echo To get your Google AI API key:
    echo 1. Visit: https://makersuite.google.com/app/apikey
    echo 2. Click 'Create API Key'
    echo 3. Copy the generated key
    echo 4. Edit .env.local and replace 'your_google_ai_api_key_here' with your actual key
    echo.
    pause
) else (
    echo [OK] .env.local already exists
)

echo.
echo Setting up database...

REM Generate Prisma client
npx prisma generate
if errorlevel 1 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
) else (
    echo [OK] Prisma client generated
)

REM Setup database
npx prisma db push
if errorlevel 1 (
    echo [ERROR] Failed to setup database
    pause
    exit /b 1
) else (
    echo [OK] Database schema applied
)

REM Seed database with sample data
echo.
echo Seeding database with sample data...
npx tsx prisma/seed.ts
if errorlevel 1 (
    echo [WARNING] Failed to seed database (this is optional)
) else (
    echo [OK] Database seeded with sample anime data
)

echo.
echo ================================
echo    Setup complete!
echo ================================
echo.
echo To start the development server:
echo    npm run dev
echo.
echo The application will be available at:
echo    http://localhost:9002
echo.
echo Features available:
echo    • Add and manage your anime watchlist
echo    • AI-powered recommendations with AniSensei
echo    • Beautiful modern UI with dark theme
echo    • Statistics and insights
echo.
echo If you encounter any issues, check the README.md for troubleshooting tips.
echo.
pause
