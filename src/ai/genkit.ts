import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GENAPI!
  })],
});

// Define anime query flow
export const animeQueryFlow = defineFlow(
  {
    name: 'animeQuery',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { query } = input;
    
    // Get all anime from database
    const animeList = await prisma.anime.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    // Create context about user's anime list
    const animeContext = animeList.map((anime: any) => ({
      title: anime.title,
      status: anime.status,
      rating: anime.rating,
      episodes: anime.episodes,
      notes: anime.notes,
      favorite: anime.favorite
    }));

    const prompt = `You are AniSensei, an AI assistant that helps users with their anime watchlist. 
    
Here is the user's current anime list:
${JSON.stringify(animeContext, null, 2)}

The user is asking: "${query}"

Please provide a helpful response based on their anime list. You can:
- Recommend anime based on what they've watched and rated highly
- Answer questions about their watch history
- Provide statistics about their viewing habits
- Suggest what to watch next based on their preferences
- Help them organize their watchlist

Be conversational, knowledgeable about anime, and reference their specific watch history when relevant.`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
    });

    return response.text;
  }
);
