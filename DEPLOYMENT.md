# 🚀 AnimeLogger Deployment Guide

This guide covers different deployment options for AnimeLogger.

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ Google AI API Key
- ✅ Environment variables configured
- ✅ Database setup completed
- ✅ Application tested locally

## 🐳 Docker Deployment

### Option 1: Docker with Docker Compose (Recommended)

1. **Create environment file**:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

2. **Start with Docker Compose**:
```bash
docker-compose up -d
```

3. **Check status**:
```bash
docker-compose ps
docker-compose logs -f anime-logger
```

4. **Access application**: http://localhost:9002

### Option 2: Manual Docker Build

1. **Build image**:
```bash
docker build -t anime-logger .
```

2. **Run container**:
```bash
docker run -d \
  --name anime-logger \
  -p 9002:9002 \
  -e GOOGLE_AI_API_KEY="your_api_key_here" \
  -e NEXTAUTH_SECRET="your_secret" \
  -v anime_data:/app/prisma \
  anime-logger
```

3. **Check logs**:
```bash
docker logs -f anime-logger
```

## ☁️ Cloud Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     ```
     GOOGLE_AI_API_KEY=your_api_key
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your_secret
     DATABASE_URL=file:./prisma/dev.db
     ```

3. **Deploy**: Vercel will automatically deploy

### Railway

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
railway login
```

2. **Deploy**:
```bash
railway new
railway link
railway up
```

3. **Set environment variables**:
```bash
railway variables set GOOGLE_AI_API_KEY=your_api_key
railway variables set NEXTAUTH_SECRET=your_secret
```

### Render

1. **Connect GitHub repository**
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
3. **Set environment variables** in dashboard

## 🏠 Self-Hosted Deployment

### VPS/Server Deployment

1. **Setup server** (Ubuntu/Debian):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Deploy application**:
```bash
# Clone repository
git clone <your-repo-url>
cd anime-watchlist

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "anime-logger" -- start
pm2 startup
pm2 save
```

3. **Setup Nginx (optional)**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:9002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ Database Options

### SQLite (Default - Development)
```env
DATABASE_URL="file:./prisma/dev.db"
```

### PostgreSQL (Production)
```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

### MySQL
```env
DATABASE_URL="mysql://username:password@host:3306/database"
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to git
- Use strong, random secrets
- Rotate API keys regularly

### Production Checklist
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Database backups configured
- [ ] Error monitoring setup
- [ ] Rate limiting implemented
- [ ] CORS properly configured

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```bash
curl http://localhost:9002/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Docker Health Check
```bash
docker inspect --format='{{.State.Health.Status}}' anime-logger
```

### Monitoring with PM2
```bash
pm2 status
pm2 logs anime-logger
pm2 monit
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Port binding issues:
```bash
# Check if port is in use
netstat -tlnp | grep :9002

# Kill process if needed
sudo kill -9 $(lsof -ti:9002)
```

#### Permission issues:
```bash
# Fix file permissions
chmod +x setup.sh
chown -R $USER:$USER .
```

#### Docker issues:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild image
docker build --no-cache -t anime-logger .
```

#### Database connection issues:
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Performance Optimization

#### Enable compression:
```javascript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  // ... other config
}
```

#### Database optimization:
```bash
# Optimize SQLite
sqlite3 prisma/dev.db "VACUUM; ANALYZE;"
```

## 📝 Deployment Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Performance testing completed
- [ ] Security audit performed

## 🆘 Support

If you encounter issues during deployment:

1. Check the [troubleshooting section](#troubleshooting)
2. Review application logs
3. Verify environment variables
4. Test locally first
5. Open an issue on GitHub with:
   - Deployment method used
   - Error messages
   - Environment details
   - Steps to reproduce

---

**Happy Deploying! 🚀**
