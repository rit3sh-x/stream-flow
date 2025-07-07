import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  icon: React.ReactNode
  title: string
  href: string
  selected: boolean
  notifications?: number
}

export const SidebarItem = ({ href, icon, selected, title, notifications }: Props) => {
  return (
    <li className="cursor-pointer my-2">
      <Link
        href={href}
        className={cn(
          'flex items-center justify-between group rounded-full hover:bg-input',
          selected ? 'bg-input' : ''
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer px-4">
          <div className='h-full flex items-center justify-center w-8'>
            {icon}
          </div>
          <span
            className={cn(
              'font-medium group-hover:text-muted-foreground transition-all truncate w-32',
              selected ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {title}
          </span>
        </div>
        {typeof notifications === 'number' && notifications > 0 && (
          <span className="mr-2 min-w-[10px] h-[10px] flex items-center justify-center rounded-full bg-red-400" />
        )}
      </Link>
    </li>
  )
}