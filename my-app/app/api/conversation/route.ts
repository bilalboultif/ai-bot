import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    
    const latestMessage = messages[messages.length - 1]?.content || '';
    const result = await model.generateContent(latestMessage);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
