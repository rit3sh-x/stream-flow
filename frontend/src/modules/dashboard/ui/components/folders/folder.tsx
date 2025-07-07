'use client';

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { Loader } from '@/components/loader';
import FolderDuotone from '@/constants/icons/folder-duotone';
import { useMutationData, useMutationDataState } from '@/hooks/use-mutation-data'
import { renameFolders } from '@/actions/workspace'
import { Input } from '@/components/ui/input'

type Props = {
  name: string
  id: string
  optimistic?: boolean
  count?: number
}

export const Folder = ({ id, name, optimistic, count }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const folderCardRef = useRef<HTMLDivElement | null>(null)
  const pathName = usePathname()
  const router = useRouter()
  const [onRename, setOnRename] = useState(false)

  const Rename = () => setOnRename(true)
  const Renamed = () => setOnRename(false)

  const { mutate, isPending } = useMutationData(
    ['rename-folders'],
    (data: { name: string }) => renameFolders(id, data.name),
    'workspace-folders',
    Renamed
  )

  const { latestVariables } = useMutationDataState(['rename-folders'])

  const handleFolderClick = () => {
    if (onRename) return
    router.push(`${pathName}/folder/${id}`)
  }

  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()
    Rename()
  }

  const updateFolderName = () => {
    if (inputRef.current) {
      if (inputRef.current.value) {
        mutate({ name: inputRef.current.value, id })
      } else Renamed()
    }
  }

  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        optimistic && 'opacity-60',
        'flex hover:bg-foreground/10 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg  border-[1px]'
      )}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap-[1px]">
          {onRename ? (
            <Input
              ref={inputRef}
              onBlur={updateFolderName}
              autoFocus
              placeholder={name}
              className={cn(
                'w-full bg-transparent text-foreground/60 placeholder:text-foreground/60',
                'text-base px-2 bg-background hover:bg-background py-0 border-none focus:outline-none focus:ring-0 focus-visible:ring-0',
                'h-auto leading-normal'
              )}
            />
          ) : (
            <p
              onClick={(e) => e.stopPropagation()}
              className="text-foreground/60"
              onDoubleClick={handleNameDoubleClick}
            >
              {latestVariables &&
                latestVariables.status === 'pending' &&
                latestVariables.variables.id === id
                ? latestVariables.variables.name
                : name}
            </p>
          )}
          <span className="text-sm text-muted-foreground">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>
  )
}