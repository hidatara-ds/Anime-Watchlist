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
        select: {
          id: true,
          title: true,
          episodes: true,
          status: true,
          rating: true,
          notes: true,
          favorite: true,
          createdAt: true,
          updatedAt: true,
          // coverImage omitted to keep payload small
        },
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
    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const episodes = Number(form.get('episodes') || 0) || 0;
    const status = (form.get('status') as Prisma.AnimeStatus) || 'PLAN';
    const rating = Number(form.get('rating') || 0) || 0;
    const notes = (form.get('notes') as string) || null;
    const favorite = String(form.get('favorite') || 'false') === 'true';

    const file = form.get('cover') as File | null;
    let coverImage: Buffer | null = null;
    let coverImageType: string | null = null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      coverImage = Buffer.from(arrayBuffer);
      coverImageType = file.type || 'image/jpeg';
    }

    const anime = await prisma.anime.create({
      data: {
        title,
        episodes,
        status,
        rating,
        notes,
        favorite,
        coverImage: coverImage ?? undefined,
        coverImageType: coverImageType ?? undefined,
      },
      select: {
        id: true,
        title: true,
        episodes: true,
        status: true,
        rating: true,
        notes: true,
        favorite: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(anime, { status: 201 });
  } catch (error) {
    console.error('Error creating anime:', error);
    return NextResponse.json({ error: 'Failed to create anime' }, { status: 500 });
  }
}
