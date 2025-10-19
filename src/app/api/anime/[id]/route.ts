import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const title = form.get('title');
      const episodes = form.get('episodes');
      const status = form.get('status');
      const rating = form.get('rating');
      const notes = form.get('notes');
      const favorite = form.get('favorite');
      if (title !== null) data.title = String(title).trim();
      if (episodes !== null) data.episodes = Number(episodes) || 0;
      if (status !== null) data.status = status as any;
      if (rating !== null) data.rating = Number(rating) || 0;
      if (notes !== null) data.notes = String(notes);
      if (favorite !== null) data.favorite = String(favorite) === 'true';

      const file = form.get('cover') as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        data.coverImage = Buffer.from(arrayBuffer);
        data.coverImageType = file.type || 'image/jpeg';
      }
    } else {
      const body = await request.json();
      const { title, episodes, status, rating, notes, favorite } = body;
      if (title !== undefined) data.title = String(title).trim();
      if (episodes !== undefined) data.episodes = episodes;
      if (status !== undefined) data.status = status;
      if (rating !== undefined) data.rating = rating;
      if (notes !== undefined) data.notes = notes;
      if (favorite !== undefined) data.favorite = favorite;
    }

    const anime = await prisma.anime.update({
      where: { id },
      data,
    });

    return NextResponse.json(anime);
  } catch (error: any) {
    console.error('Error updating anime:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update anime' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.anime.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting anime:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete anime' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const anime = await prisma.anime.findUnique({
      where: { id },
      select: { coverImage: true, coverImageType: true },
    });
    if (!anime || !anime.coverImage) {
      return new NextResponse('Not found', { status: 404 });
    }
    const headers = new Headers();
    headers.set('Content-Type', anime.coverImageType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return new NextResponse(anime.coverImage as any, { headers });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
