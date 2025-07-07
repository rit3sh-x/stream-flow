import {
  getAllUserVideos,
  getWorkspaceFolders,
} from '@/actions/workspace'
import { CreateFolders } from '@/modules/dashboard/ui/components/create-folders'
import { CreateWorkspace } from '@/modules/dashboard/ui/components/create-workspace'
import { Folders } from '@/modules/dashboard/ui/components/folders'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const Page = async ({ params }: Props) => {
  const query = new QueryClient();
  const { workspaceId } = await params;

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="mt-6">
        <div className="flex w-full justify-between items-center">
          <div />
          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-8">
          <Folders workspaceId={workspaceId} />
        </section>
      </div>
    </HydrationBoundary>
  );
};

export default Page;