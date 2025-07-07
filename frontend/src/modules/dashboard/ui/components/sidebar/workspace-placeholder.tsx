import React from 'react'

type Props = { children: React.ReactNode }

export const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <span className="bg-muted-foreground flex items-center font-bold justify-center w-8 px-2 h-7 rounded-sm text-background/80">
      {children}
    </span>
  )
}