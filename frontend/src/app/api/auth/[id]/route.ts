import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('Enpoint hit ✅')

  const { id } = await params;

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        clerkid: id,
      },
      include: {
        studio: true,
      },
    })

    if (userProfile) {
      const { has } = await auth();
      const hasPro = has({ plan: 'pro' });
      return NextResponse.json({ status: 200, user: { ...userProfile, hasPro } })
    }

    const clerk = await clerkClient();
    const clerkUserInstance = await clerk.users.getUser(id)
    const createUser = await prisma.user.create({
      data: {
        clerkid: id,
        email: clerkUserInstance.emailAddresses[0].emailAddress,
        firstname: clerkUserInstance.firstName,
        lastname: clerkUserInstance.lastName,
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${clerkUserInstance.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
    })

    if (createUser) return NextResponse.json({ status: 201, user: { ...createUser, hasPro: false } })

    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('ERROR', error)
  }
}