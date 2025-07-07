import { createWorkspace } from '@/actions/workspace'
import { useMutationData } from './use-mutation-data'
import { useZodForm } from './use-zod-form'
import { z } from 'zod'

const workspaceSchema = z.object({
  name: z.string().min(1, { message: 'Workspace name cannot be empty' }),
})

export const useCreateWorkspace = (onSuccess?: () => void) => {
  const { mutate, isPending } = useMutationData(
    ['create-workspace'],
    (data: { name: string }) => createWorkspace(data.name),
    'user-workspaces',
    onSuccess
  )

  const { errors, onFormSubmit, register } = useZodForm(workspaceSchema, mutate)
  return { errors, onFormSubmit, register, isPending }
}