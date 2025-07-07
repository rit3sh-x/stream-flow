import { auth } from '@clerk/nextjs/server'
import React from 'react'

const BillingPage = async () => {
  const {has} = await auth();
  const hasPro = has({ plan: 'pro' });

  return (
    <div className="bg-secondary flex flex-col gap-y-8 p-5 rounded-xl">
      <div>
        <h2 className="text-2xl">Current Plan</h2>
        <p className="text-muted-foreground">Your Payment Histroy</p>
      </div>
      <div>
        <h2 className="text-2xl">
          ${hasPro ? '99' : '0'}/Month
        </h2>
        <p className="text-muted-foreground">{hasPro ? "PREMIUM" : "FREE"}</p>
      </div>
    </div>
  )
}

export default BillingPage