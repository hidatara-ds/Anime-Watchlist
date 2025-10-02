import { NextRequest, NextResponse } from 'next/server';
import { runFlow } from '@genkit-ai/flow';
import { animeQueryFlow } from '@/ai/genkit';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Run the anime query flow
    const response = await runFlow(animeQueryFlow, {
      query: message,
    });

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Chat API is running',
    status: 'healthy'
  });
}
