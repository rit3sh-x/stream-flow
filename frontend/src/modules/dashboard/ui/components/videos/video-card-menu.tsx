import React, { useState } from 'react'
import { Modal } from '@/components/modal'
import { Move } from 'lucide-react'
import { ChangeVideoLocation } from '../../forms/change-video-location'

type Props = {
  videoId: string
  currentWorkspace?: string
  currentFolder?: string
}

export const CardMenu = ({
  videoId,
  currentFolder,
  currentWorkspace,
}: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="This will move you video permanently to other Workspace/folder."
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Move
          size={20}
          className="text-foreground"
        />
      }
    >
      <ChangeVideoLocation
        currentFolder={currentFolder}
        currentWorkSpace={currentWorkspace}
        videoId={videoId}
        onClose={() => setOpen(false)}
      />
    </Modal>
  )
}