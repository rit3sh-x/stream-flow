import { useZodForm } from './use-zod-form'
import { useMutationData } from './use-mutation-data'
import { editVideoInfo } from '@/actions/workspace'
import { z } from 'zod'

const editVideoInfoSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Video title must have atleast 5 characters' }),
  description: z.string().min(100, {
    message: 'Video description must have atleast 100 characters',
  }),
})

export const useEditVideo = (
  videoId: string,
  title: string,
  description: string
) => {
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string }) =>
      editVideoInfo(videoId, data.title, data.description),
    'preview-video'
  )
  const { errors, onFormSubmit, register } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending }
}