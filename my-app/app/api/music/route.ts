import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Replicate from "replicate";
import { checkSubscription } from '@/lib/subscription';
import { increaseApiLimit , checkApiLimit} from '@/lib/api-limit';


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
    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()
    if (!freeTrial && !isPro) {
      return new NextResponse("Fress trial has expired", { status: 403})
    }
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: { prompt_a: prompt }
      }
    );
    await increaseApiLimit()
    const { audio } = response;
    if (!audio) {
      console.error('No audio URL in response');
      return new NextResponse('Audio URL not found', { status: 500 });
    }

    return NextResponse.json({ audio });
  } catch (error) {
    console.error('[MUSIC_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
