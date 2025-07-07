'use client'
import React from 'react'
import { Loader } from '@/components/loader'
import { CardMenu } from './video-card-menu'
import { CopyLink } from './copy-link'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dot, Share2, User } from 'lucide-react'

type Props = {
  User: {
    firstname: string | null
    lastname: string | null
    image: string | null
  } | null
  id: string
  Folder: {
    id: string
    name: string
  } | null
  createdAt: Date
  title: string | null
  source: string
  processing: boolean
  workspaceId: string
}

export const VideoCard = (props: Props) => {
  const daysAgo = Math.floor((new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000))

  return (
    <Loader
      className="bg-transparent flex justify-center items-center border-[1px] border-sidebar rounded-xl"
      state={props.processing}
    >
      <div className=" group overflow-hidden cursor-pointer bg-transparent relative border-[1px] border-foreground/50 flex flex-col rounded-xl">
        <div className="absolute top-0 right-0 z-50 hidden group-hover:flex items-start justify-end gap-x-3 p-3">
          <div className='flex items-center justify-center gap-x-3'>
            <CardMenu
              videoId={props.id}
              currentWorkspace={props.workspaceId}
              currentFolder={props.Folder?.id}
            />
            <CopyLink
              className="text-foreground h-8"
              videoId={props.id}
            />
          </div>
        </div>
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-foreground/10 transition duration-150 flex flex-col justify-between h-full"
        >
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20"
          >
            <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>
          <div className="px-5 py-3 flex flex-col gap-7-2 z-20">
            <h2 className="text-sm font-semibold text-foreground">
              {props.title}
            </h2>
            <div className="flex gap-x-2 items-center mt-4">
              <Avatar className=" w-8 h-8">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="capitalize text-xs text-foreground">
                  {props.User?.firstname} {props.User?.lastname}
                </p>
                <p className="text-muted-foreground  text-xs flex items-center ">
                  <Dot /> {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="flex gap-x-1 items-center">
                <Share2
                  className="text-muted-foreground"
                  size={12}
                />
                <p className="text-xs text-muted-foreground capitalize">
                  {props.User?.firstname}&apos;s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  )
}