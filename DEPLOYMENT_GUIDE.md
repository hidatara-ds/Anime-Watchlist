# 🚀 Deployment Guide - Anime Watchlist

Panduan lengkap untuk deploy aplikasi Anime Watchlist ke Vercel dengan database gratis.

## 📋 Prerequisites

- GitHub account
- Vercel account (gratis)
- Database provider account (Neon/Supabase - gratis)

## 🗄️ Database Setup (Pilih salah satu)

### Option 1: Neon (Recommended - PostgreSQL gratis)

1. **Daftar di [Neon](https://neon.tech)**
2. **Create new project**
3. **Copy connection string** yang diberikan
4. **Format**: `postgresql://username:password@host:port/database`

### Option 2: Supabase (PostgreSQL gratis)

1. **Daftar di [Supabase](https://supabase.com)**
2. **Create new project**
3. **Go to Settings > Database**
4. **Copy connection string**

### Option 3: Railway (PostgreSQL gratis)

1. **Daftar di [Railway](https://railway.app)**
2. **Create new project**
3. **Add PostgreSQL database**
4. **Copy connection string**

## 🚀 Vercel Deployment

### Step 1: Push ke GitHub

```bash
# Jika belum ada git repo
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/username/anime-watchlist.git
git push -u origin main
```

### Step 2: Deploy ke Vercel

1. **Login ke [Vercel](https://vercel.com)**
2. **Click "New Project"**
3. **Import dari GitHub repository**
4. **Configure project settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 3: Setup Environment Variables

Di Vercel dashboard, tambahkan environment variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_AI_API_KEY=your_google_ai_api_key (optional)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_random_secret_key
NODE_ENV=production
```

### Step 4: Database Migration

Setelah deploy, jalankan migration:

```bash
# Via Vercel CLI
npx vercel env pull .env.local
npx prisma db push

# Atau via Vercel dashboard terminal
npx prisma db push
```

## 🔧 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/username/anime-watchlist.git
cd anime-watchlist
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
# Copy environment file
cp env.example .env.local

# Edit .env.local dengan database URL Anda
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed database
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

## 🌐 Production URLs

- **Vercel**: `https://your-app.vercel.app`
- **Database**: Sesuai provider yang dipilih

## 🔍 Troubleshooting

### Database Connection Issues
- Pastikan `DATABASE_URL` benar
- Check database provider status
- Verify connection string format

### Build Errors
- Check Node.js version (18+)
- Verify all dependencies installed
- Check environment variables

### API Errors
- Verify database connection
- Check Prisma client generation
- Review API route logs

## 📊 Monitoring

- **Vercel Analytics**: Built-in di Vercel dashboard
- **Database Monitoring**: Sesuai provider (Neon/Supabase/Railway)
- **Error Tracking**: Vercel Functions logs

## 🔄 Updates

Untuk update aplikasi:
1. Push changes ke GitHub
2. Vercel akan auto-deploy
3. Database schema akan auto-migrate

## 💰 Cost Breakdown

- **Vercel**: Gratis (hobby plan)
- **Neon**: Gratis (0.5GB storage)
- **Supabase**: Gratis (500MB database)
- **Railway**: Gratis ($5 credit/month)

Total: **100% GRATIS** 🎉
