'use server';

import { prisma } from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'
import { sendEmail } from './user'
import { createClient, OAuthStrategy } from '@wix/sdk'
import { items } from '@wix/data'

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const isUserInWorkspace = await prisma.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    })
    return {
      status: 200,
      data: { workspace: isUserInWorkspace },
    }
  } catch {
    return {
      status: 403,
      data: { workspace: null },
    }
  }
}

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await prisma.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders }
    }
    return { status: 404, data: [] }
  } catch {
    return { status: 403, data: [] }
  }
}

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const videos = await prisma.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (videos && videos.length > 0) {
      return { status: 200, data: videos }
    }

    return { status: 404 }
  } catch {
    return { status: 400 }
  }
}

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser()

    if (!user) return { status: 404 }
    const { has } = await auth();
    const hasPro = has({ plan: 'pro' })

    const workspaces = await prisma.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })

    if (workspaces) {
      return { status: 200, data: { ...workspaces, hasPro } }
    }
  } catch {
    return { status: 400 }
  }
}

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const { has } = await auth();
    const hasPro = has({ plan: 'pro' });

    if (hasPro) {
      const workspace = await prisma.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: 'PUBLIC',
            },
          },
        },
      })
      if (workspace) {
        return { status: 201, data: 'Workspace Created' }
      }
    }
    return {
      status: 401,
      data: 'You are not authorized to create a workspace.',
    }
  } catch {
    return { status: 400 }
  }
}

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    })
    if (folder) {
      return { status: 200, data: 'Folder Renamed' }
    }
    return { status: 400, data: 'Folder does not exist' }
  } catch {
    return { status: 500, data: 'Opps! something went wrong' }
  }
}

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await prisma.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: 'Untitled' },
        },
      },
    })
    if (isNewFolder) {
      return { status: 200, message: 'New Folder Created' }
    }
  } catch {
    return { status: 500, message: 'Oppse something went wrong' }
  }
}

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (folder)
      return {
        status: 200,
        data: folder,
      }
    return {
      status: 400,
      data: null,
    }
  } catch {
    return {
      status: 500,
      data: null,
    }
  }
}

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    })
    if (location) return { status: 200, data: 'folder changed successfully' }
    return { status: 404, data: 'workspace/folder not found' }
  } catch {
    return { status: 500, data: 'Oops! something went wrong' }
  }
}

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const { has } = await auth();
    const hasPro = has({ plan: 'pro' })
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
          },
        },
      },
    })
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
        hasPro
      }
    }

    return { status: 404 }
  } catch {
    return { status: 400 }
  }
}

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const firstViewSettings = await prisma.user.findUnique({
      where: { clerkid: user.id },
      select: {
        firstView: true,
      },
    })
    if (!firstViewSettings?.firstView) return

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    })
    if (video && video.views === 0) {
      await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          views: video.views + 1,
        },
      })

      if (!video.User?.email) {
        console.log('No email found for video owner')
        return { status: 400, message: 'Video owner email not found' }
      }

      const { transporter, mailOptions } = await sendEmail(
        video.User.email,
        'You got a viewer',
        `Your video ${video.title} just got its first viewer`
      )

      transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error.message)
        } else {
          const notification = await prisma.user.update({
            where: { clerkid: user.id },
            data: {
              notification: {
                create: {
                  content: mailOptions.text,
                },
              },
            },
          })
          if (notification) {
            return { status: 200 }
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const editVideoInfo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
      },
    })
    if (video) return { status: 200, data: 'Video successfully updated' }
    return { status: 404, data: 'Video not found' }
  } catch {
    return { status: 400 }
  }
}

export const getWixContent = async () => {
  try {
    const myWixClient = createClient({
      modules: { items },
      auth: OAuthStrategy({
        clientId: process.env.WIX_OAUTH_KEY,
      }),
    })

    const videos = await myWixClient.items
      .query('Flow')
      .find()

    const videoIds = videos.items.map((v) => v.title)

    if(!videoIds) {
      return {
        staus: 404,
        data: []
      }
    }

    const video = await prisma.video.findMany({
      where: {
        id: {
          in: videoIds,
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        source: true,
        processing: true,
        workSpaceId: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (video && video.length > 0) {
      return { status: 200, data: video }
    }
    return { status: 404 }
  } catch {
    return { status: 400 }
  }
}