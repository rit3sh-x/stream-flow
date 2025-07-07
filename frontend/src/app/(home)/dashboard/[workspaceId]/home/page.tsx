import { getWixContent } from '@/actions/workspace'
import { VideoCard } from '@/modules/dashboard/ui/components/videos/video-card'
import React from 'react'

const Home = async () => {
  const videos = await getWixContent()

  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <h1 className="text-2xl font-bold">A Message From The Flow Team</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:w-1/2">
        {videos.status === 200
          ? videos.data?.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              workspaceId={video.workSpaceId!}
            />
          ))
          : ''}
      </div>
    </div>
  )
}

export default Home