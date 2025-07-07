import { useEffect, useState } from 'react'
import { searchUsers } from '@/actions/user'
import { useQueryData } from './use-query-data'

export const useSearch = (key: string, type: 'USERS') => {
  const [query, setQuery] = useState('')
  const [debounce, setDebounce] = useState('')
  const [onUsers, setOnUsers] = useState<
    | {
      id: string
      firstname: string | null
      lastname: string | null
      image: string | null
      email: string | null
      plan: string
    }[]
    | undefined
  >(undefined)

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query)
    }, 1000)
    return () => clearTimeout(delayInputTimeoutId)
  }, [query])

  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === 'USERS') {
        const users = await searchUsers(queryKey[1] as string)
        if (users.status === 200) {
          setOnUsers(users.data)
          return users.data
        }
        return []
      }
      return []
    },
    !!debounce
  )

  useEffect(() => {
    if (debounce) {
      refetch()
    }
    if (!debounce) {
      setOnUsers(undefined)
    }
  }, [debounce, refetch])

  return { onSearchQuery, query, isFetching, onUsers }
}