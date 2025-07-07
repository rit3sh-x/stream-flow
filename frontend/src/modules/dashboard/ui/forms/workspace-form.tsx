import { FormGenerator } from '@/components/form-generator'
import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { useCreateWorkspace } from '@/hooks/use-create-workspace'

type Props = {
  onSuccess?: () => void
}

export const WorkspaceForm = ({ onSuccess }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace(onSuccess)
  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-3 mt-4"
    >
      <FormGenerator
        register={register}
        name="name"
        placeholder={'Workspace Name'}
        errors={errors}
        inputType="input"
        type="text"
      />
      <Button
        className="text-sm w-full mt-2"
        type="submit"
        disabled={isPending}
      >
        <Loader state={isPending}>Create Workspace</Loader>
      </Button>
    </form>
  )
}