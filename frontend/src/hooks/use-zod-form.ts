/* eslint-disable @typescript-eslint/no-explicit-any */

import { UseMutateFunction } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z, { type ZodSchema } from 'zod'

export const useZodForm = <Schema extends ZodSchema<any, any>>(
  schema: Schema,
  mutation: UseMutateFunction<any, any, z.infer<Schema>, any>,
  defaultValues?: z.infer<Schema>
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onFormSubmit = handleSubmit(values => mutation(values))

  return { register, watch, reset, onFormSubmit, errors }
}