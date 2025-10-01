import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { title, coverUrl, episodes, status, rating, notes, favorite } = body;

    const anime = await prisma.anime.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(episodes !== undefined && { episodes }),
        ...(status !== undefined && { status }),
        ...(rating !== undefined && { rating }),
        ...(notes !== undefined && { notes }),
        ...(favorite !== undefined && { favorite }),
      },
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
