import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Loader } from '@/components/loader'
import { useRouter } from 'next/navigation'

export const PaymentButton = () => {
    const [clicked, setClicked] = useState(false);
    const router = useRouter();

    return (
        <Button
            className="text-sm w-full "
            onClick={() => {
                setClicked(true);
                router.push("/pricing")
            }}
        >
            <Loader
                color="#000"
                state={clicked}
            >
                Upgrade
            </Loader>
        </Button>
    )
}