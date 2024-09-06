import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';

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

async function fetchWithRetry(fetchFunction: () => Promise<any>, retries: number = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (i === retries - 1) {
        throw error; // Re-throw after last retry
      }
      console.warn('Retrying due to error:', error);
      await new Promise(res => setTimeout(res, 1000)); // Wait before retrying
    }
  }
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

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired', { status: 403 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const latestMessage = messages[messages.length - 1]?.content || '';

    if (isCodingQuestion(latestMessage)) {
      try {
        const result = await fetchWithRetry(() => model.generateContent(latestMessage));
        const response = await result.response;
        if (!isPro) {
          await increaseApiLimit();
        }
        const text = await response.text();
        return NextResponse.json({ text });
      } catch (generateError) {
        console.error('[CODE_GENERATION_ERROR]', generateError);
        return new NextResponse('Error generating code. Please try again later.', { status: 500 });
      }
    } else {
      return new NextResponse('I can\'t answer this. Can I help you with a coding question?', { status: 400 });
    }
  } catch (error) {
    console.error('[SERVER_ERROR]', error);
    return new NextResponse('Internal Server Error. Please try again later.', { status: 500 });
  }
}
