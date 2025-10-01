# AnimeLogger - Project Documentation

## Overview
AnimeLogger is a Next.js anime tracking application that allows users to manage their anime watchlist. The app provides a comprehensive dashboard with statistics, CRUD operations for anime entries, and data export functionality.

## Recent Changes (September 30, 2025)

### Database Migration
- **Migrated from localStorage to SQLite** with Prisma ORM for better data persistence
- Created Prisma schema with `Anime` model including all fields (title, episodes, status, rating, notes, coverUrl, favorite)
- Implemented Prisma client singleton pattern for connection pooling
- Added database seeding with sample anime data

### API Implementation
- **GET /api/anime** - Fetch anime list with filtering (status, search), pagination, and sorting
- **POST /api/anime** - Create new anime entry with validation
- **PUT /api/anime/[id]** - Update existing anime entry
- **DELETE /api/anime/[id]** - Delete anime entry
- **GET /api/stats** - Calculate and return dashboard statistics (total, completed, avg rating, top favorites)
- **GET /api/export.csv** - Export anime data to CSV format with status filtering

### Frontend Fixes
- **AnimeForm Title Bug Fix**: Fixed issue where Title field couldn't be typed into by wrapping form.reset() in setTimeout
- **Stats Dashboard**: Created 3-card dashboard showing Total Anime, Completed with Avg Rating, and Top Favorites
- **Stats Refresh Fix**: Implemented refreshTrigger prop to ensure stats cards update after CRUD operations and initial data load

### Technical Improvements
- Fixed TypeScript type imports for Prisma client
- Resolved React warnings about component state updates during render
- Configured Next.js to run on port 5000 with proper host settings for Replit environment
- Added proper error handling and toast notifications throughout the app

## Project Architecture

### Database Layer
- **Technology**: SQLite with Prisma ORM
- **Schema**: Single `Anime` model with enum for status types
- **Location**: `prisma/dev.db` (committed for Replit persistence)

### API Layer
- **Framework**: Next.js App Router API routes
- **Validation**: Zod schemas for input validation
- **Error Handling**: Try-catch blocks with proper HTTP status codes

### Frontend Layer
- **Framework**: Next.js 15 with React
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React hooks (useState, useEffect)
- **Forms**: React Hook Form with Zod validation

## Key Features
1. **Anime Management**: Add, edit, delete anime entries with full CRUD support
2. **Status Tracking**: Track anime status (Plan to Watch, Watching, Completed, On Hold, Dropped)
3. **Rating System**: 0-10 rating scale with favorite marking
4. **Statistics Dashboard**: Real-time stats with total count, completed count with average rating, and top favorites
5. **Filtering & Search**: Filter by status and search by title
6. **CSV Export**: Export filtered anime data to CSV format
7. **Responsive UI**: Dark theme with sea green accents

## Important Files
- `prisma/schema.prisma` - Database schema definition
- `src/lib/prisma.ts` - Prisma client singleton
- `src/lib/types.ts` - TypeScript type definitions
- `src/app/api/anime/route.ts` - Main anime CRUD endpoints
- `src/app/api/stats/route.ts` - Statistics calculation endpoint
- `src/app/api/export.csv/route.ts` - CSV export endpoint
- `src/components/anime-watchlist.tsx` - Main watchlist component
- `src/components/stats-cards.tsx` - Dashboard statistics cards
- `src/components/anime-form.tsx` - Add/Edit anime form
- `next.config.ts` - Next.js configuration with Replit settings

## Development Notes
- App runs on port 5000 (configured for Replit environment)
- SQLite database file is committed to repository for persistence
- Next.js dev server configured with `allowedDevOrigins: ['*']` for Replit proxy
- Some harmless hydration warnings in dev mode (app functions correctly)
- Prisma client generates types after `npm install` - may need regeneration if schema changes

## Known Issues
- Hydration warnings in browser console (cosmetic, doesn't affect functionality)
- Next.js dev warning about cross-origin requests (cosmetic, configured correctly)

## Future Enhancements
- Add image upload for custom cover images
- Implement user authentication
- Add anime recommendations based on ratings
- Create backup/restore functionality
- Add tags/genres for better categorization
