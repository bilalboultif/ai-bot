import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: { prompt }
      }
    );

    // Check the entire response object for debugging
    console.log('Replicate Response:', response);

    const { video } = response;
    if (!video) {
      console.error('No video URL in response');
      return new NextResponse('Video URL not found', { status: 500 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error('[VIDEO_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
