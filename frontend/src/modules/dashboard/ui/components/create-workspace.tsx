'use client';

import React, { useState } from 'react'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import FolderPlusDuotine from '@/constants/icons/folder-plus-duotone'
import { WorkspaceForm } from '../forms/workspace-form'
import { useAuth } from '@clerk/nextjs';

export const CreateWorkspace = () => {
  const { has } = useAuth();
  const hasPro = has?.({ plan: 'pro' });
  const [open, setOpen] = useState(false)

  if (hasPro) {
    return (
      <Modal
        title="Create a Workspace"
        description=" Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button className="bg-foreground text-background/80 flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create Workspace
          </Button>
        }
      >
        <WorkspaceForm onSuccess={() => setOpen(false)} />
      </Modal>
    )
  }
  return null
}