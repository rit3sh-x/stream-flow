'use server'

import { prisma } from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'
import axios from 'axios'

export const generateVideoSummary = async (videoId: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404, data: 'User not found' }

        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: { User: true }
        })

        if (!video || video.User?.clerkid !== user.id) {
            return { status: 404, data: 'Video not found' }
        }

        const userData = await prisma.user.findUnique({
            where: { clerkid: user.id },
            select: { trial: true }
        })

        if (userData && userData.trial) {
            return { status: 403, data: 'Trial already used. Upgrade to PRO for unlimited AI features.' }
        }

        const { getToken } = await auth();
        const token = await getToken();

        const aiResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/transcribe`,
            {
                filename: video.source,
                content: JSON.stringify({
                    title: video.title,
                    summary: video.description
                }),
                transcript: video.summary || ''
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if (aiResponse.status === 200) {
            await prisma.user.update({
                where: { clerkid: user.id },
                data: { trial: true }
            })
            return { status: 200, data: 'AI summary generated successfully!' }
        }

        return { status: 400, data: 'Failed to generate summary' }
    } catch (error) {
        console.error('AI generation error:', error)
        return { status: 500, data: 'Something went wrong' }
    }
}

export const checkAiUsage = async () => {
    try {
        const user = await currentUser()
        if (!user) return { canUse: false, hasUsedTrial: true }

        const userData = await prisma.user.findUnique({
            where: { clerkid: user.id },
            select: { trial: true }
        })

        return {
            canUse: !userData?.trial,
            hasUsedTrial: userData?.trial || false
        }
    } catch {
        return { canUse: false, hasUsedTrial: true }
    }
}