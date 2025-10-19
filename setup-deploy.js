#!/usr/bin/env node

/**
 * Quick Deploy Setup Script
 * Setup project untuk deploy ke Vercel dengan database gratis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Anime Watchlist - Deploy Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

console.log('📋 Setup Options:');
console.log('1. Neon (PostgreSQL) - Recommended');
console.log('2. Supabase (PostgreSQL)');
console.log('3. Railway (PostgreSQL)');
console.log('4. Skip database setup\n');

// Create .env.local if it doesn't exist
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# Database - Replace with your database URL
DATABASE_URL="postgresql://username:password@host:port/database"

# Google AI (Optional - for AI features)
GOOGLE_AI_API_KEY=""

# NextAuth (Optional - for authentication)
NEXTAUTH_URL="http://localhost:9002"
NEXTAUTH_SECRET="your_random_secret_key_here"

# Environment
NODE_ENV="development"
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created\n');
}

console.log('🔧 Next Steps:');
console.log('1. Get your database URL from:');
console.log('   - Neon: https://neon.tech (Recommended)');
console.log('   - Supabase: https://supabase.com');
console.log('   - Railway: https://railway.app');
console.log('');
console.log('2. Update .env.local with your DATABASE_URL');
console.log('');
console.log('3. Run database setup:');
console.log('   node scripts/setup-database.js');
console.log('');
console.log('4. Start development:');
console.log('   npm run dev');
console.log('');
console.log('5. Deploy to Vercel:');
console.log('   - Push to GitHub');
console.log('   - Connect to Vercel');
console.log('   - Add environment variables');
console.log('   - Deploy!');
console.log('');
console.log('📚 For detailed instructions, see DEPLOYMENT_GUIDE.md');
console.log('');
console.log('🎉 Setup script completed!');
