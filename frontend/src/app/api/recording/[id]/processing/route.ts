import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { id } = await params
    const { has } = await auth();
    const hasPro = has({ plan: 'pro' });

    const personalworkspaceId = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        workspace: {
          where: {
            type: 'PERSONAL',
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
    const startProcessingVideo = await prisma.workSpace.update({
      where: {
        id: personalworkspaceId?.workspace[0].id,
      },
      data: {
        videos: {
          create: {
            source: body.filename,
            userId: id,
          },
        },
      },
    })

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200,
        plan: hasPro ? "PRO" : "FREE",
      })
    }
    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('🔴 Error in processing video', error)
  }
}