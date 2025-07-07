'use client';

import { getFolderInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/use-query-data'
import React from 'react'
import { FolderProps } from '@/constants/types';
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react';

type Props = {
  folderId: string
}

export const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))
  const { data: folder } = data as FolderProps
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="p-2 rounded hover:bg-accent"
        aria-label="Go back"
      >
        <ArrowLeft className='text-foreground size-6'/>
      </button>
      <h2 className="text-foreground text-2xl">{folder.name}</h2>
    </div>
  )
}