'use server';

import { prisma } from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'
import nodemailer from 'nodemailer'

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  })

  const mailOptions = {
    to,
    subject,
    text,
    html,
  }
  return { transporter, mailOptions }
}

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { status: 403 }
    }

    const userExist = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    })
    if (userExist) {
      return { status: 200, user: userExist }
    }

    const newUser = await prisma.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    })
    if (newUser) {
      return { status: 201, user: newUser }
    }
    return { status: 400 }
  } catch (error) {
    console.log('🔴 ERROR', error)
    return { status: 500 }
  }
}

export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const notifications = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications }
    return { status: 404, data: [] }
  } catch {
    return { status: 400, data: [] }
  }
}

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        image: true,
        email: true,
        plan: true,
      },
    })

    if (users && users.length > 0) {
      return { status: 200, data: users }
    }

    return { status: 404, data: undefined }
  } catch {
    return { status: 500, data: undefined }
  }
}

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser()

    if (!user) return { status: 404 }

    const view = await prisma.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    })

    if (view) {
      return { status: 200, data: 'Setting updated' }
    }
  } catch {
    return { status: 400 }
  }
}

export const getFirstView = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const userData = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    })
    if (userData) {
      return { status: 200, data: userData.firstView }
    }
    return { status: 400, data: false }
  } catch {
    return { status: 400 }
  }
}

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      })
      if (reply) {
        return { status: 200, data: 'Reply posted' }
      }
    }

    const newComment = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
    if (newComment) return { status: 200, data: 'New comment added' }
  } catch {
    return { status: 400 }
  }
}

export const getUserProfile = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const profileIdAndImage = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    })

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
  } catch {
    return { status: 400 }
  }
}

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })

    return { status: 200, data: comments }
  } catch {
    return { status: 400 }
  }
}

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const senderInfo = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    })

    if (senderInfo?.id) {
      const existingMember = await prisma.member.findFirst({
        where: {
          userId: recieverId,
          workSpaceId: workspaceId,
        },
      })

      if (existingMember) {
        return { status: 400, data: 'User is already a member of this workspace' }
      }

      const existingInvite = await prisma.invite.findFirst({
        where: {
          recieverId,
          workSpaceId: workspaceId,
          accepted: false,
        },
      })

      if (existingInvite) {
        return { status: 400, data: 'User already has a pending invitation' }
      }

      const workspace = await prisma.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      })

      if (workspace) {
        const invitation = await prisma.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        })

        await prisma.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        })

        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            'You got an invitation',
            'You are invited to join ${workspace.name} Workspace, click accept to confirm',
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          )

          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.log('🔴', error.message)
            } else {
              console.log('✅ Email send')
            }
          })
          return { status: 200, data: 'Invite sent' }
        }
        return { status: 400, data: 'invitation failed' }
      }
      return { status: 404, data: 'workspace not found' }
    }
    return { status: 404, data: 'recipient not found' }
  } catch {
    return { status: 400, data: 'Oops! something went wrong' }
  }
}

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user)
      return {
        status: 404,
      }
    const invitation = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        accepted: true,
        reciever: {
          select: {
            clerkid: true,
            id: true
          },
        },
      },
    })

    if (!invitation || user.id !== invitation?.reciever?.clerkid) return { status: 401 }
    if (invitation.accepted) {
      return { status: 400, data: 'Invitation has already been accepted' }
    }
    const existingMember = await prisma.member.findFirst({
      where: {
        userId: invitation.reciever.id,
        workSpaceId: invitation.workSpaceId,
      },
    })

    if (existingMember) {
      return { status: 400, data: 'User is already a member of this workspace' }
    }
    const acceptInvite = prisma.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    })

    const updateMember = prisma.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    })

    const membersTransaction = await prisma.$transaction([
      acceptInvite,
      updateMember,
    ])

    if (membersTransaction) {
      return { status: 200 }
    }
    return { status: 400 }
  } catch {
    return { status: 400 }
  }
}

export const checkPlan = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { status: 404, message: 'User not found' }
    }

    const { has } = await auth()
    const hasPro = has({ plan: 'pro' })

    await prisma.user.update({
      where: { clerkid: user.id },
      data: { plan: hasPro ? 'PRO' : 'FREE' },
    })
    return { status: 200 }
  } catch {
    return { status: 400, error: 'Failed to update plan' }
  }
}