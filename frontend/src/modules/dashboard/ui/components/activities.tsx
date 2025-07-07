'use client'
import { CommentForm } from '../forms/comment-form'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { CommentCard } from './comment-card'
import { useQueryData } from '@/hooks/use-query-data'
import { getVideoComments } from '@/actions/user'
import { VideoCommentProps } from '@/constants/types'

type Props = {
    author: string
    videoId: string
}

export const Activities = ({ author, videoId }: Props) => {
    const { data } = useQueryData(['video-comments'], () =>
        getVideoComments(videoId)
    )

    const { data: comments } = data as VideoCommentProps


    return (
        <TabsContent
            value="Activity"
            className="rounded-xl flex flex-col gap-y-5"
        >
            <CommentForm
                author={author}
                videoId={videoId}
            />
            {comments?.map((comment) => (
                <CommentCard
                    comment={comment.comment}
                    key={comment.id}
                    author={{
                        image: comment.User?.image || "",
                        firstname: comment.User?.firstname || "",
                        lastname: comment.User?.lastname || "",
                    }}
                    videoId={videoId}
                    reply={comment.reply}
                    commentId={comment.id}
                    createdAt={comment.createdAt}
                />
            ))}
        </TabsContent>
    )
}