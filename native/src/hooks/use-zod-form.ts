import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, useForm } from 'react-hook-form';
import { z } from 'zod';

export const useZodForm = <T extends z.ZodTypeAny>(
  schema: T,
  defaultValues?: DefaultValues<z.infer<T>> | undefined
) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return {
    register,
    errors,
    handleSubmit,
    watch,
    reset,
    setValue,
  };
};