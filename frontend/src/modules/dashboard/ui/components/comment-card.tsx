'use client'
import { CommentForm } from '../forms/comment-form'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CommentRepliesProps } from '@/constants/types'
import { DotIcon } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
  comment: string
  author: { image: string; firstname: string; lastname: string }
  videoId: string
  commentId?: string
  reply: CommentRepliesProps[]
  isReply?: boolean
  createdAt: Date
}

export const CommentCard = ({
  author,
  comment,
  reply,
  videoId,
  commentId,
  isReply,
  createdAt,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false)
  const daysAgo = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )

  return (
    <Card
      className={cn(
        isReply
          ? 'bg-muted pl-10 border-none shadow-none'
          : 'border-[1px] bg-muted p-5 shadow-none',
        'relative'
      )}
    >
      <div className="flex gap-x-2 items-center">
        <Avatar>
          <AvatarImage
            src={author.image}
            alt="author"
          />
        </Avatar>
        <div className="capitalize text-sm text-foreground flex">
          {author.firstname} {author.lastname}{' '}
          <div className="flex items-center gap-[0]">
            <DotIcon className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs ml-[-6px]">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-foreground/90">{comment}</p>
      </div>
      {!isReply && (
        <div className="flex justify-end ">
          {!onReply ? (
            <Button
              onClick={() => setOnReply(true)}
              className="text-sm rounded-full bg-foreground text-background absolute z-[1] top-8"
            >
              Reply
            </Button>
          ) : (
            <CommentForm
              close={() => setOnReply(false)}
              videoId={videoId}
              commentId={commentId}
              author={author.firstname + ' ' + author.lastname}
            />
          )}
        </div>
      )}
      {reply.length > 0 && (
        <div className="flex flex-col gap-y-10 mt-3  border-l-2">
          {reply.map((r) => (
            <CommentCard
              isReply
              reply={[]}
              comment={r.comment}
              commentId={r.commentId!}
              videoId={videoId}
              key={r.id}
              author={{
                image: r.User?.image || "",
                firstname: r.User?.firstname || "",
                lastname: r.User?.lastname || "",
              }}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      )}
    </Card>
  )
}