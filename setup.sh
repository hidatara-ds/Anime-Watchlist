#!/bin/bash

# AnimeLogger Setup Script
# This script helps you set up the AnimeLogger application quickly

echo "🌟 Welcome to AnimeLogger Setup!"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    print_info "Visit: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    print_status "Node.js is installed: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
else
    NPM_VERSION=$(npm -v)
    print_status "npm is installed: $NPM_VERSION"
fi

echo ""
print_info "Setting up AnimeLogger..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Setup environment file
echo ""
echo "🔧 Setting up environment configuration..."

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    print_status "Created .env.local file"
    print_warning "Please edit .env.local and add your Google AI API key"
    
    echo ""
    echo "📋 To get your Google AI API key:"
    echo "1. Visit: https://makersuite.google.com/app/apikey"
    echo "2. Click 'Create API Key'"
    echo "3. Copy the generated key"
    echo "4. Edit .env.local and replace 'your_google_ai_api_key_here' with your actual key"
    echo ""
    
    read -p "Press Enter after you've added your API key to .env.local..."
else
    print_status ".env.local already exists"
fi

# Generate Prisma client
echo "🗄️  Setting up database..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_status "Prisma client generated"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Setup database
npx prisma db push
if [ $? -eq 0 ]; then
    print_status "Database schema applied"
else
    print_error "Failed to setup database"
    exit 1
fi

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
npx tsx prisma/seed.ts
if [ $? -eq 0 ]; then
    print_status "Database seeded with sample anime data"
else
    print_warning "Failed to seed database (this is optional)"
fi

echo ""
print_status "🎉 Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   http://localhost:9002"
echo ""
echo "🤖 Features available:"
echo "   • Add and manage your anime watchlist"
echo "   • AI-powered recommendations with AniSensei"
echo "   • Beautiful modern UI with dark theme"
echo "   • Statistics and insights"
echo ""
print_info "If you encounter any issues, check the README.md for troubleshooting tips."
