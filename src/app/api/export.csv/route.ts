import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as Prisma.AnimeStatus | 'all' | null;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const animeList = await prisma.anime.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'id',
      'title',
      'coverUrl',
      'episodes',
      'status',
      'rating',
      'favorite',
      'notes',
      'createdAt',
      'updatedAt',
    ];

    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [
      headers.join(','),
      ...animeList.map((anime: any) =>
        headers.map((header) => escapeCSV(anime[header as keyof typeof anime])).join(',')
      ),
    ];

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="anime_export.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
