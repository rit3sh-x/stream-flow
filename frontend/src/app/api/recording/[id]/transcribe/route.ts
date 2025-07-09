import { prisma } from '@/lib/prisma'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { filename } = await req.json()
  const { id } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { clerkid: id },
      select: {
        trial: true,
        plan: true,
        id: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isEligible = user.plan == "PRO" || user.trial;

    if (!isEligible) {
      return NextResponse.json(
        { error: 'User not eligible for transcription. Upgrade to Pro or start trial.' },
        { status: 403 }
      )
    }

    const video = await prisma.video.findFirst({
      where: {
        userId: user.id,
        source: filename,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const gladiaHeaders = {
      'x-gladia-key': process.env.GLADIA_API_KEY,
      'Content-Type': 'application/json',
    };

    const requestData = {
      audio_url: `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`,
      diarization: true,
      language: 'en',
      callback: true,
      callback_config: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/webhooks/gladia`,
        method: "POST"
      },
    };

    const initialResponse = await axios.post(
      'https://api.gladia.io/v2/transcription/',
      requestData,
      { headers: gladiaHeaders }
    );

    await prisma.video.update({
      where: { id: video.id },
      data: {
        transcriptionId: initialResponse.data.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Transcription request submitted successfully'
    });

  } catch (error) {
    console.error('🔴 Transcription request error:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit transcription request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}