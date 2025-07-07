import React from 'react'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { EditVideoForm } from '../../forms/edit-video'

type Props = { title: string; description: string; videoId: string }

export const EditVideo = ({ description, title, videoId }: Props) => {
  return (
    <Modal
      title="Edit video details"
      description="You can update your video details here!"
      trigger={
        <Button variant={'ghost'}>
          <Edit className="text-muted-foreground" />
        </Button>
      }
    >
      <EditVideoForm
        videoId={videoId}
        title={title}
        description={description}
      />
    </Modal>
  )
}