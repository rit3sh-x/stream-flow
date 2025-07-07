import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useMoveVideos } from '@/hooks/use-folders'
import React from 'react'

type Props = {
  videoId: string
  currentFolder?: string
  currentWorkSpace?: string
  onClose: () => void
}

export const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentWorkSpace,
  onClose
}: Props) => {
  const {
    register,
    isPending,
    onFormSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkSpace!, onClose)

  const folder = folders.find((f) => f.id === currentFolder)
  const workspace = workspaces.find((w) => w.id === currentWorkSpace)

  return (
    <form
      className="flex flex-col gap-y-5"
      onSubmit={onFormSubmit}
    >
      <div className="border-[1px] border-border rounded-xl p-5">
        <h2 className="text-xs text-muted-foreground">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-muted-foreground mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : 'This video has no folder'}
      </div>

      <Separator orientation="horizontal" />

      <div className="flex flex-col gap-y-5 p-5 border-[1px] border-border rounded-xl">
        <h2 className="text-xs text-muted-foreground">To</h2>

        <Label className="flex flex-col gap-y-2">
          <p className="text-xs text-foreground">Workspace</p>
          <select
            className="rounded-xl text-base bg-background text-foreground px-3 py-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
            {...register('workspace_id')}
          >
            {workspaces.map((space) => (
              <option
                key={space.id}
                className="text-foreground"
                value={space.id}
              >
                {space.name}
              </option>
            ))}
          </select>
        </Label>

        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs text-foreground">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register('folder_id')}
                className="rounded-xl text-base bg-background text-foreground px-3 py-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
              >
                {isFolders.map((folder) => (
                  <option
                    key={folder.id}
                    value={folder.id}
                    className="text-foreground"
                  >
                    {folder.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-muted-foreground text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>

      <Button type="submit">
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  )
}