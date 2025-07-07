'use client'
import { getPreviewVideo, sendEmailForFirstView } from '@/actions/workspace'
import { useQueryData } from '@/hooks/use-query-data'
import { VideoProps } from '@/constants/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'
import { CopyLink } from './copy-link'
import { RichLink } from './rich-link'
import { truncateString } from '@/lib/utils'
import { Download } from 'lucide-react'
import { TabMenu } from '@/components/tabs'
import { AiTools } from '../ai-tools'
import { VideoTranscript } from '../video-transcript'
import { Activities } from '../activities'
import { EditVideo } from './edit'

type Props = {
    videoId: string
}

export const VideoPreview = ({ videoId }: Props) => {
    const router = useRouter();

    const { data } = useQueryData(['preview-video'], () =>
        getPreviewVideo(videoId)
    )

    const notifyFirstView = useCallback(async () => {
        await sendEmailForFirstView(videoId)
    }, [videoId])

    const { data: video, status, author, hasPro } = data as VideoProps
    if (status !== 200) router.push('/')

    const daysAgo = Math.floor(
        (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    useEffect(() => {
        if (video.views === 0) {
            notifyFirstView()
        }
        return () => {
            notifyFirstView()
        }
    }, [notifyFirstView, video.views])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
            <div className="flex flex-col lg:col-span-2 gap-y-10">
                <div>
                    <div className="flex gap-x-5 items-start justify-between">
                        <h2 className="text-foreground text-4xl font-bold">{video.title}</h2>
                        {author ? (
                            <EditVideo
                                videoId={videoId}
                                title={video.title as string}
                                description={video.description as string}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <span className="flex gap-x-3 mt-2">
                        <p className="text-muted-foreground capitalize">
                            {video.User?.firstname} {video.User?.lastname}
                        </p>
                        <p className="text-muted-foreground/60">
                            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </p>
                    </span>
                </div>
                <video
                    preload="metadata"
                    className="w-full aspect-video opacity-50 rounded-xl"
                    controls
                >
                    <source
                        src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
                    />
                </video>
                <div className="flex flex-col text-2xl gap-y-4">
                    <div className="flex gap-x-5 items-center justify-between">
                        <p className="text-muted-foreground text-semibold">Description</p>
                        {author ? (
                            <EditVideo
                                videoId={videoId}
                                title={video.title as string}
                                description={video.description as string}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <p className="text-muted-foreground/60 text-lg text-medium">
                        {video.description}
                    </p>
                </div>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-y-16">
                <div className="flex justify-end gap-x-3 items-center">
                    <CopyLink
                        variant="outline"
                        className="rounded-full bg-transparent px-10"
                        videoId={videoId}
                    />
                    <RichLink
                        description={truncateString(video.description as string, 150)}
                        id={videoId}
                        source={video.source}
                        title={video.title as string}
                    />
                    <Download className="text-muted-foreground" />
                </div>
                <div>
                    <TabMenu
                        defaultValue={hasPro ? "Transcript" : "AI tools"}
                        triggers={hasPro ? ['Transcript', 'Activity'] : ['AI tools', 'Transcript', 'Activity']}
                    >
                        {!hasPro && (
                            <AiTools
                                videoId={videoId}
                                trial={video.User?.trial || false}
                            />
                        )}
                        <VideoTranscript transcript={video.summary!} />
                        <Activities
                            author={video.User?.firstname || "Unknown"}
                            videoId={videoId}
                        />
                    </TabMenu>
                </div>
            </div>
        </div>
    )
}