import { useAppSelector } from '@/modules/redux/store'
import { useEffect, useState } from 'react'
import { useMutationData } from './use-mutation-data'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import { useZodForm } from './use-zod-form'
import { z } from 'zod'

const moveVideoSchema = z.object({
  folder_id: z.string().optional(),
  workspace_id: z.string(),
})

export const useMoveVideos = (videoId: string, currentWorkspace: string, onSuccess?: () => void) => {
  const { folders } = useAppSelector((state) => state.FolderReducer)
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer)

  const [isFetching, setIsFetching] = useState(false)
  const [isFolders, setIsFolders] = useState<
    | ({
      _count: {
        videos: number
      }
    } & {
      id: string
      name: string
      createdAt: Date
      workSpaceId: string | null
    })[]
    | undefined
  >(undefined)

  const { mutate, isPending } = useMutationData(
    ['change-video-location'],
    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id),
    [
      'workspace-folders',
      'user-videos',
      'preview-video'
    ],
    () => {
      onSuccess?.();
    }
  )

  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    mutate,
    { folder_id: undefined, workspace_id: currentWorkspace }
  )

  const fetchFolders = async (workspace: string) => {
    setIsFetching(true)
    const folders = await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
  }
  useEffect(() => {
    fetchFolders(currentWorkspace)
  }, [currentWorkspace])

  useEffect(() => {
    const workspace = watch(async (value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id)
    })

    return () => workspace.unsubscribe()
  }, [watch])

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  }
}