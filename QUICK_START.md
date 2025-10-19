# 🚀 Quick Start - Deploy Anime Watchlist

## ⚡ Super Quick Setup (5 menit)

### 1. Setup Database Gratis
Pilih salah satu (semua gratis):

**🔥 Neon (Recommended)**
- Daftar di [neon.tech](https://neon.tech)
- Create project → Copy connection string

**Supabase**
- Daftar di [supabase.com](https://supabase.com)  
- Create project → Settings → Database → Copy connection string

**Railway**
- Daftar di [railway.app](https://railway.app)
- Create project → Add PostgreSQL → Copy connection string

### 2. Setup Project
```bash
# Clone project
git clone https://github.com/username/anime-watchlist.git
cd anime-watchlist

# Install dependencies
npm install

# Setup deployment
npm run setup:deploy

# Edit .env.local dengan database URL Anda
# DATABASE_URL="postgresql://username:password@host:port/database"

# Setup database
npm run setup:db

# Test deployment
npm run test:deploy
```

### 3. Deploy ke Vercel
```bash
# Push ke GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Deploy ke Vercel
# 1. Login ke vercel.com
# 2. Import dari GitHub
# 3. Add environment variables:
#    - DATABASE_URL (dari step 1)
#    - GOOGLE_AI_API_KEY (optional)
# 4. Deploy!
```

## 🎯 Environment Variables

Di Vercel dashboard, tambahkan:

```env
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_AI_API_KEY=your_key_here (optional)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=random_secret_key
NODE_ENV=production
```

## 🧪 Test Local

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:9002
```

## 📊 Database Management

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --accept-data-loss

# Seed sample data
npm run db:seed
```

## 🆘 Troubleshooting

**Database connection error?**
- Check DATABASE_URL format
- Verify database is running
- Check firewall settings

**Build error?**
- Run `npm run test:deploy`
- Check Node.js version (18+)
- Clear node_modules: `rm -rf node_modules && npm install`

**Vercel deploy error?**
- Check environment variables
- Verify build logs
- Check function timeout settings

## 💰 Cost

- **Vercel**: Gratis
- **Database**: Gratis (0.5GB-1GB)
- **Total**: 100% GRATIS! 🎉

## 📚 Full Documentation

Lihat `DEPLOYMENT_GUIDE.md` untuk panduan lengkap.
