import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { filename } = await req.json()
    const { id } = await params

    const personalworkspaceId = await prisma.user.findUnique({
      where: {
        clerkid: id,
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
        }
      },
    })
    const startProcessingVideo = await prisma.workSpace.update({
      where: {
        id: personalworkspaceId?.workspace[0].id,
      },
      data: {
        videos: {
          create: {
            source: filename,
            userId: id,
          },
        },
      },
    })

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200
      })
    }
    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log('🔴 Error in processing video', error)
    return NextResponse.json({ status: 400 });
  }
}