import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as Prisma.AnimeStatus | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    const sort = searchParams.get('sort') || 'createdAt';

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      prisma.anime.findMany({
        where,
        orderBy: { [sort]: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.anime.count({ where }),
    ]);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching anime:', error);
    return NextResponse.json({ error: 'Failed to fetch anime' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, coverUrl, episodes, status, rating, notes, favorite } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const anime = await prisma.anime.create({
      data: {
        title: title.trim(),
        coverUrl: coverUrl || null,
        episodes: episodes || 0,
        status: status || 'PLAN',
        rating: rating || 0,
        notes: notes || null,
        favorite: favorite || false,
      },
    });

    return NextResponse.json(anime, { status: 201 });
  } catch (error) {
    console.error('Error creating anime:', error);
    return NextResponse.json({ error: 'Failed to create anime' }, { status: 500 });
  }
}
