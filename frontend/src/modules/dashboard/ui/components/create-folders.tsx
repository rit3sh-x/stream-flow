'use client'

import FolderPlusDuotine from '@/constants/icons/folder-plus-duotone'
import { Button } from '@/components/ui/button'
import { useCreateFolders } from '@/hooks/use-create-folders'
import React from 'react'

type Props = { workspaceId: string }

export const CreateFolders = ({ workspaceId }: Props) => {
    const { onCreateNewFolder } = useCreateFolders(workspaceId)
    return (
        <Button
            onClick={onCreateNewFolder}
            className="bg-foreground text-background/80 flex items-center gap-2 py-6 px-4 rounded-2xl"
        >
            <FolderPlusDuotine />
            Create A folder
        </Button>
    )
}