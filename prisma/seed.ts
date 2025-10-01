import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.anime.deleteMany();

  await prisma.anime.createMany({
    data: [
      {
        title: "Frieren: Beyond Journey's End",
        episodes: 28,
        status: 'COMPLETED',
        rating: 10,
        notes: 'A masterpiece of fantasy storytelling. Emotional and beautiful.',
        favorite: true,
      },
      {
        title: 'Jujutsu Kaisen',
        episodes: 47,
        status: 'WATCHING',
        rating: 9,
        notes: 'Incredible animation and hype moments.',
        favorite: true,
      },
      {
        title: 'Vinland Saga',
        episodes: 48,
        status: 'COMPLETED',
        rating: 9,
        notes: 'Season 2 is a profound character study.',
        favorite: false,
      },
      {
        title: 'Oshi no Ko',
        episodes: 11,
        status: 'PLAN',
        rating: 0,
        notes: 'Heard great things about this one.',
        favorite: false,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
