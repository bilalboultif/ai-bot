import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(API_KEY);

function isCodingQuestion(query: string): boolean {
  const codingKeywords = ["code", "function", "python", "javascript", "error", "bug", "react"];
  const regex = new RegExp('\\b(' + codingKeywords.join('|') + ')\\b', 'i');
  return regex.test(query);
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Messages are required and should be an array', { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const latestMessage = messages[messages.length - 1]?.content || '';

    // Check if the message is a coding question
    if (isCodingQuestion(latestMessage)) {
      try {
        const result = await model.generateContent(latestMessage);
        const response = await result.response;
        const text = await response.text();
        return NextResponse.json({ text });
      } catch (generateError) {
        console.error('[CODE_GENERATION_ERROR]', generateError);
        return new NextResponse('Error generating code', { status: 500 });
      }
    } else {
      // Handle non-coding questions
      return new NextResponse('I can\'t answer this. Can I help you with a coding question?', { status: 400 });
    }
  } catch (error) {
    console.error('[SERVER_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
