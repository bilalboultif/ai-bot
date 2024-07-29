import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "6c1f4b88-5afa-4612-b590-7b539fc18cb2";

if (!API_KEY) {
  throw new Error('API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {prompt, amount =1, resolution = "512x512"} = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!prompt) {
      return new NextResponse('prompt is required', { status: 400 });
    }
    if (!amount) {
      return new NextResponse('amount is required', { status: 400 });
    }
    if (!resolution) {
      return new NextResponse('resolution is required', { status: 400 });
    }

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'api-key': '6c1f4b88-5afa-4612-b590-7b539fc18cb2'
      },
      body: JSON.stringify({
          text: "YOUR_TEXT_URL",
      })
  });
  
  const data = await response.json();
  console.log(data);
    
 

    
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
