import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkSubscription } from '@/lib/subscription';
import { increaseApiLimit, checkApiLimit } from '@/lib/api-limit';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = '512x512' } = body;

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

    // Check subscription and API limit
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse('Free trial has expired', { status: 403 });
    }

    // Construct the URL with the provided parameters
    const [width, height] = resolution.split('x').map(Number);
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width || 1024}&height=${height || 1024}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      return new NextResponse('Image generation failed', { status: response.status });
    }

    // Directly return the image URL from the Pollinations API
    const imageUrl = response.url; // Assuming the response URL is directly usable

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('[IMAGE_GENERATION_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
