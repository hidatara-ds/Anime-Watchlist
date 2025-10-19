#!/usr/bin/env node

/**
 * Database Setup Script
 * Menjalankan migration dan seeding database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.log('Please set DATABASE_URL in your .env.local file');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed\n');

  // Check if seed file exists
  const seedFile = path.join(process.cwd(), 'prisma', 'seed.ts');
  if (fs.existsSync(seedFile)) {
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded\n');
  }

  console.log('🎉 Database setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" to start development server');
  console.log('2. Visit http://localhost:9002 to see your app');
  console.log('3. Use "npx prisma studio" to manage your database');

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
