import { FormGenerator } from '@/components/form-generator'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useEditVideo } from '@/hooks/use-edit-video'
import React from 'react'

type Props = {
  videoId: string
  title: string
  description: string
}

export const EditVideoForm = ({ description, title, videoId }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useEditVideo(
    videoId,
    title,
    description
  )

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-5"
    >
      <FormGenerator
        register={register}
        errors={errors}
        name="title"
        inputType="input"
        type="text"
        placeholder={'Video Title...'}
        label="Title"
      />

      <FormGenerator
        register={register}
        label="Description"
        errors={errors}
        name="description"
        inputType="textarea"
        type="text"
        lines={5}
        placeholder={'Video Description...'}
      />
      <Button>
        <Loader state={isPending}>Update</Loader>
      </Button>
    </form>
  )
}