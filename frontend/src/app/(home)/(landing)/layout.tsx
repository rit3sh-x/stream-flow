import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className='flex items-center flex-col'>
      {children}
    </div>
  )
}

export default Layout