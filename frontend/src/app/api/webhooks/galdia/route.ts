import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
})

async function getLLMResult(input: string, fallback: string, systemPrompt: string, userPrompt: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `${userPrompt}:\nTranscript: ${input}`
                }
            ],
            temperature: 0.7,
            max_tokens: 60,
        });
        return completion.choices[0]?.message?.content?.trim() || fallback;
    } catch {
        return fallback;
    }
}

async function generateVideoMetadata(transcript: string) {
    const title = await getLLMResult(
        transcript,
        "Transcribed Video",
        "You are a helpful assistant that generates concise video titles. Return ONLY the title text, no quotes, no explanations, no alternatives. Keep it under 60 characters.",
        "Generate a single engaging title for this video transcript"
    );

    const description = await getLLMResult(
        transcript,
        "Auto-generated from video transcription",
        "You are a helpful assistant that generates video descriptions. Return ONLY the description text, no quotes, no explanations. Keep it under 200 characters.",
        "Generate a brief description for this video transcript"
    );

    const summary = await getLLMResult(
        transcript,
        "Video content has been transcribed and processed",
        "You are a helpful assistant that generates video summaries. Return ONLY the summary text, no quotes, no explanations. Keep it under 300 characters.",
        "Generate a concise summary for this video transcript"
    );

    return { title, description, summary };
}

async function getTranscript(transcriptionId: string) {
    try {
        const response = await fetch(`https://api.gladia.io/v2/transcription/${transcriptionId}`, {
            headers: {
                'X-Gladia-Key': process.env.GLADIA_API_KEY!,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch transcript: ${response.status}`);
        }

        const data = await response.json();
        return data.result?.transcription?.full_transcript;
    } catch (error) {
        console.error('Error fetching Gladia transcript:', error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    let transcriptionId: string | null = null;

    try {
        if (body.event !== 'transcription.success') {
            console.log("ℹ️ Received non-success event:", body.event);
            return NextResponse.json({ message: 'Event acknowledged' }, { status: 200 });
        }

        transcriptionId = body.payload?.id;

        if (!transcriptionId) {
            console.error("❌ Missing transcription ID in webhook payload");
            return NextResponse.json({ error: 'Missing transcription ID' }, { status: 400 });
        }

        const video = await prisma.video.findFirst({
            where: {
                transcriptionId: transcriptionId
            },
        });

        if (!video) {
            console.error("❌ Video not found for transcription ID:", transcriptionId);
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const fullTranscript = await getTranscript(transcriptionId);

        if (!fullTranscript) {
            console.error("❌ Failed to retrieve transcript from Gladia");
            await prisma.video.update({
                where: { id: video.id },
                data: {
                    processing: false,
                },
            });
            return NextResponse.json({ error: 'Failed to retrieve transcript' }, { status: 500 });
        }

        console.log("🤖 Generating video metadata...");
        const metadata = await generateVideoMetadata(fullTranscript);

        await prisma.video.update({
            where: { id: video.id },
            data: {
                title: metadata.title,
                description: metadata.description,
                summary: metadata.summary,
                processing: false,
                transcriptionId: "",
            },
        });

        console.log("✅ Webhook processed successfully for video:", video.id);
        return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        if (transcriptionId) {
            try {
                const video = await prisma.video.findFirst({
                    where: {
                        transcriptionId: transcriptionId
                    },
                });

                if (video) {
                    await prisma.video.update({
                        where: { id: video.id },
                        data: {
                            processing: false,
                            transcriptionId: "",
                        },
                    });
                    console.log("🔄 Reset video processing state for video:", video.id);
                }
            } catch (cleanupError) {
                console.error("❌ Failed to cleanup video state:", cleanupError);
            }
        }

        return NextResponse.json(
            {
                error: 'Failed to process webhook',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}