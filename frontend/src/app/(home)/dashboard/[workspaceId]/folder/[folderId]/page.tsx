import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import { FolderInfo } from '@/modules/dashboard/ui/components/folders/forlder-info'
import { Videos } from '@/modules/dashboard/ui/components/videos'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'

type Props = {
  params: Promise<{
    folderId: string
    workspaceId: string
  }>
}

const Page = async ({ params }: Props) => {
  const { folderId, workspaceId } = await params;
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ['folder-videos'],
    queryFn: () => getAllUserVideos(folderId),
  })

  await query.prefetchQuery({
    queryKey: ['folder-info'],
    queryFn: () => getFolderInfo(folderId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={folderId} />
      <Videos
        workspaceId={workspaceId}
        folderId={folderId}
        videosKey="folder-videos"
      />
    </HydrationBoundary>
  )
}

export default Page