'use client'
import { FormGenerator } from '@/components/form-generator'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useVideoComment } from '@/hooks/use-video'
import { Send } from 'lucide-react'
import React from 'react'

type Props = {
  videoId: string
  commentId?: string
  author: string
  close?: () => void
}

export const CommentForm = ({ author, videoId, commentId, close }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useVideoComment(
    videoId,
    commentId,
    close
  )

  return (
    <form
      className="relative w-full"
      onSubmit={onFormSubmit}
    >
      <FormGenerator
        register={register}
        errors={errors}
        placeholder={`Respond to ${author}...`}
        name="comment"
        inputType="input"
        lines={8}
        type="text"
      />
      <Button
        className="p-0 bg-transparent absolute top-[1px] right-3 hover:bg-transparent "
        type="submit"
      >
        <Loader state={isPending}>
          <Send
            className="text-muted-foreground/60 cursor-pointer hover:text-muted-foreground"
            size={18}
          />
        </Loader>
      </Button>
    </form>
  )
}