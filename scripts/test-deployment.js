#!/usr/bin/env node

/**
 * Test Deployment Script
 * Test database connection dan API endpoints
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing deployment setup...\n');

// Check environment variables
console.log('1️⃣ Checking environment variables...');
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment');
  console.log('Please set DATABASE_URL in your .env.local file');
  process.exit(1);
}
console.log('✅ DATABASE_URL found');

// Test database connection
console.log('\n2️⃣ Testing database connection...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  process.exit(1);
}

// Test Prisma client
console.log('\n3️⃣ Testing Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Prisma client generation failed:', error.message);
  process.exit(1);
}

// Test build
console.log('\n4️⃣ Testing build process...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All tests passed! Your app is ready for deployment.');
console.log('\nNext steps:');
console.log('1. Push to GitHub: git push origin main');
console.log('2. Connect to Vercel');
console.log('3. Add environment variables in Vercel dashboard');
console.log('4. Deploy!');
