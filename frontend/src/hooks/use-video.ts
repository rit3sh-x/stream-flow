import { useMutationData } from './use-mutation-data'
import { useQueryData } from './use-query-data'
import { useZodForm } from './use-zod-form'
import { createCommentAndReply, getUserProfile } from '@/actions/user'
import { z } from 'zod'

const createCommentSchema = z.object({
  comment: z.string().min(1, { message: 'Comment cannot be empty' }),
})

export const useVideoComment = (
  videoId: string,
  commentId?: string,
  onSuccess?: () => void
) => {
  const { data } = useQueryData(['user-profile'], getUserProfile)

  const { data: user } = data as {
    status: number
    data: { id: string; image: string }
  }
  const { isPending, mutate } = useMutationData(
    ['new-comment'],
    (data: { comment: string }) =>
      createCommentAndReply(user.id, data.comment, videoId, commentId),
    'video-comments',
    () => {
      reset()
      onSuccess?.()
    }
  )

  const { register, onFormSubmit, errors, reset } = useZodForm(
    createCommentSchema,
    mutate
  )
  return { register, errors, onFormSubmit, isPending }
}