import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [total, completed, allRatings, topFavorites] = await Promise.all([
      prisma.anime.count(),
      prisma.anime.count({ where: { status: 'COMPLETED' } }),
      prisma.anime.findMany({
        where: { rating: { gt: 0 } },
        select: { rating: true },
      }),
      prisma.anime.findMany({
        where: { favorite: true },
        orderBy: { rating: 'desc' },
        take: 3,
        select: { id: true, title: true, rating: true },
      }),
    ]);

    const avgRating = allRatings.length > 0
      ? allRatings.reduce((sum: number, { rating }: { rating: number }) => sum + rating, 0) / allRatings.length
      : 0;

    return NextResponse.json({
      total,
      completed,
      avgRating: Math.round(avgRating * 10) / 10,
      topFavorites,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
