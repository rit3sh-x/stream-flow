import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const LandingPageNavBar = () => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Image
          alt="flow"
          src="/logo.svg"
          width={32}
          height={32}
        />
        Flow
      </div>
      <Link href="/sign-in">
        <Button className="text-base flex gap-x-2">
          <User/>
          Login
        </Button>
      </Link>
    </div>
  )
}