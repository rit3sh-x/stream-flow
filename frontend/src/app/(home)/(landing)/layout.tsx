import React from 'react'
import { LandingPageNavBar } from '@/modules/home/ui/components/navbar'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container mx-auto">
      <LandingPageNavBar />
      {children}
    </div>
  )
}

export default Layout