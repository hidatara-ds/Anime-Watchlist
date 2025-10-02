# 🌟 AnimeLogger - Modern Anime Watchlist Tracker

A beautiful, modern anime watchlist tracker with AI-powered recommendations, built with Next.js 15, Tailwind CSS, and Google Gemini AI.

![AnimeLogger Preview](https://via.placeholder.com/800x400/0a0e27/00d9ff?text=AnimeLogger)

## ✨ Features

### 🎯 **Core Features**
- 📝 **Complete Anime Management** - Track with 5 statuses (Plan, Watching, Completed, On Hold, Dropped)
- ⭐ **Rating System** - Rate anime from 1-10 with interactive star ratings
- ❤️ **Favorites System** - Mark and filter your favorite anime
- 📊 **Advanced Statistics** - Detailed insights into your viewing habits
- 🔍 **Powerful Search & Filtering** - Real-time search with multiple filter options
- 🎨 **Beautiful Modern UI** - Dark theme with glassmorphism effects and smooth animations

### 🤖 **AI Integration**
- **AniSensei AI Assistant** - Powered by Google Gemini AI
- **Contextual Recommendations** - AI analyzes your watchlist for personalized suggestions
- **Natural Language Queries** - Ask questions about your viewing habits
- **Real-time Chat Interface** - Beautiful floating chat window with typing indicators

### 🎨 **Modern Design**
- **Glassmorphism UI** - Translucent cards with backdrop blur effects
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly dark interface with cyan/purple accents
- **Grid/List Views** - Toggle between card grid and compact list layouts

## 🚀 Quick Start

### 🎯 **Option 1: Automated Setup (Recommended)**

#### For Linux/macOS:
```bash
git clone <your-repo-url>
cd anime-watchlist
chmod +x setup.sh
./setup.sh
```

#### For Windows:
```bash
git clone <your-repo-url>
cd anime-watchlist
setup.bat
```

The setup script will:
- ✅ Check system requirements
- ✅ Install dependencies
- ✅ Create environment configuration
- ✅ Setup database
- ✅ Seed sample data
- ✅ Guide you through API key setup

### 🎯 **Option 2: Manual Setup**

#### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm, yarn, or pnpm**
- **Google AI API Key** - [Get one here](https://makersuite.google.com/app/apikey)

#### Step-by-Step Installation

1. **Clone and Install**:
```bash
git clone <your-repo-url>
cd anime-watchlist
npm install
```

2. **Setup Environment**:
```bash
cp .env.example .env.local
# Edit .env.local and add your Google AI API key
```

3. **Database Setup**:
```bash
npm run db:generate
npm run db:push
npm run db:seed  # Optional: Add sample data
```

4. **Start Development**:
```bash
npm run dev
```

5. **Open Browser**: Visit [http://localhost:9002](http://localhost:9002) 🎉

## 🔑 Environment Configuration

### Required Environment Variables

Create a `.env.local` file with:

```env
# Database (SQLite for development)
DATABASE_URL="file:./prisma/dev.db"

# Google AI API Key (REQUIRED)
GOOGLE_AI_API_KEY="your_google_ai_api_key_here"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="your_random_secret_here"
```

### 🔐 **Getting Google AI API Key**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the generated key
4. Add it to your `.env.local` file

⚠️ **Important**: The application will not work without a valid Google AI API key!

## 🐳 Docker Deployment

### Quick Docker Setup

1. **Build and Run**:
```bash
# Set your API key in .env.local first
npm run docker:build
npm run docker:run
```

2. **Or use Docker Compose**:
```bash
# Create .env.local with your API key
docker-compose up -d
```

### Production Docker Deployment

```bash
# Build production image
docker build -t anime-logger .

# Run with environment variables
docker run -d \
  -p 9002:9002 \
  -e GOOGLE_AI_API_KEY="your_api_key" \
  -e NEXTAUTH_SECRET="your_secret" \
  -v anime_data:/app/prisma \
  --name anime-logger \
  anime-logger
```

## 📱 Usage Guide

### 🎬 **Adding Anime**
1. Click the **floating "+" button** (bottom-right)
2. Fill in anime details:
   - **Title** (required)
   - **Episodes count**
   - **Status** (Plan to Watch, Watching, etc.)
   - **Rating** (1-10 stars)
   - **Cover image URL** (optional)
   - **Personal notes**
   - **Mark as favorite**
3. Click **"Add Anime"**
4. Get instant success notification!

### 📋 **Managing Your Watchlist**
- **Search**: Real-time search with suggestions
- **Filter**: By status, rating, favorites
- **Sort**: By title, rating, date added
- **Views**: Toggle between Grid and List
- **Quick Actions**: Edit, delete, favorite toggle

### 🤖 **AI Assistant (AniSensei)**
- Click **chat button** (bottom-left) 
- Ask questions like:
  - "What should I watch next?"
  - "What's my highest rated anime?"
  - "Recommend something like Attack on Titan"
  - "What's my completion rate?"

### 📊 **Statistics Dashboard**
- **Animated stats cards** with real-time data
- **Progress tracking** by status
- **Rating distribution** 
- **Viewing patterns** analysis

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Apply schema changes
npm run db:seed         # Seed with sample data
npm run db:studio       # Open Prisma Studio

# AI Development
npm run genkit:dev      # Start Genkit dev server
npm run genkit:watch    # Watch mode for AI development

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
npm run docker:compose  # Start with docker-compose

# Setup
npm run setup           # Run automated setup (Linux/macOS)
```

## 🏗️ Project Architecture

```
anime-watchlist/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 anime/         # Anime CRUD operations
│   │   │   ├── 📁 ai/chat/       # AI chat endpoint
│   │   │   └── 📁 health/        # Health check
│   │   ├── globals.css           # Global styles & theme
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main application
│   │
│   ├── 📁 components/            # React Components
│   │   ├── 📁 ui/               # Base UI (Radix + Custom)
│   │   ├── add-anime-modal.tsx   # Add anime form
│   │   ├── ai-chat-bubble.tsx    # AI chat interface
│   │   ├── main-layout.tsx       # App layout
│   │   ├── modern-anime-cards.tsx # Anime cards
│   │   ├── sidebar-navigation.tsx # Sidebar nav
│   │   └── ...                   # Other components
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utilities & config
│   └── 📁 ai/                   # AI integration
│
├── 📁 prisma/                   # Database
│   ├── schema.prisma            # DB schema
│   ├── seed.ts                  # Sample data
│   └── dev.db                   # SQLite database
│
├── 📁 Docker files
│   ├── Dockerfile               # Production container
│   ├── docker-compose.yml       # Multi-service setup
│   └── .dockerignore            # Docker ignore rules
│
├── 📁 Setup scripts
│   ├── setup.sh                # Linux/macOS setup
│   ├── setup.bat               # Windows setup
│   └── .env.example            # Environment template
│
└── 📄 Configuration
    ├── next.config.ts           # Next.js config
    ├── tailwind.config.ts       # Tailwind config
    ├── package.json             # Dependencies & scripts
    └── tsconfig.json            # TypeScript config
```

## 🔧 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **SQLite** - Lightweight database (dev)
- **PostgreSQL** - Production database option

### **AI & Integration**
- **Google Gemini AI** - Advanced language model
- **Genkit Framework** - AI application framework
- **Real-time Chat** - WebSocket-like experience

### **DevOps & Deployment**
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Vercel** - Recommended deployment platform
- **Health Checks** - Container monitoring

## 🚀 Deployment Options

### **🌟 Vercel (Recommended)**
```bash
# Push to GitHub and connect to Vercel
# Add environment variables in Vercel dashboard
```

### **🐳 Docker Production**
```bash
# Build and deploy with Docker
docker build -t anime-logger .
docker run -d -p 9002:9002 --env-file .env anime-logger
```

### **☁️ Railway/Render**
```bash
# Deploy with git integration
# Set environment variables in platform dashboard
```

### **🏠 Self-hosted**
```bash
npm run build
npm run start
```

## 🔍 Troubleshooting

### **Common Issues**

#### **❌ "API key not found" Error**
```bash
# Check .env.local file exists and has correct API key
cat .env.local | grep GOOGLE_AI_API_KEY
```

#### **❌ Database Connection Error**
```bash
# Regenerate Prisma client
npm run db:generate
npm run db:push
```

#### **❌ Port 9002 Already in Use**
```bash
# Kill existing process
lsof -ti:9002 | xargs kill -9
# Or change port in package.json
```

#### **❌ Docker Build Fails**
```bash
# Clean Docker cache
docker system prune -a
# Rebuild without cache
docker build --no-cache -t anime-logger .
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: ESLint + Prettier
4. **Add tests** for new functionality
5. **Update documentation**
6. **Submit Pull Request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[MyAnimeList](https://myanimelist.net)** & **[AniList](https://anilist.co)** for inspiration
- **[Radix UI](https://radix-ui.com)** for accessible components
- **[Framer Motion](https://framer.com/motion)** for beautiful animations
- **[Lucide](https://lucide.dev)** for gorgeous icons
- **[Google AI](https://ai.google.dev)** for powerful AI capabilities
- **[Vercel](https://vercel.com)** for amazing deployment platform

---

<div align="center">

**Built with ❤️ for the anime community**

[🌟 Star this repo](https://github.com/yourusername/anime-watchlist) • [🐛 Report Bug](https://github.com/yourusername/anime-watchlist/issues) • [💡 Request Feature](https://github.com/yourusername/anime-watchlist/issues)

**AnimeLogger** - *Where Anime Tracking Meets Modern Design*

</div>