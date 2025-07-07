import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type Props = {
    triggers: string[]
    children: React.ReactNode
    defaultValue: string
}

export const TabMenu = ({ children, defaultValue, triggers }: Props) => {
    return (
        <Tabs
            defaultValue={defaultValue}
            className="w-full"
        >
            <TabsList className="flex justify-start bg-transparent">
                {triggers.map((trigger) => (
                    <TabsTrigger
                        key={trigger}
                        value={trigger}
                        className="capitalize text-base data-[state=active]:bg-muted-foreground/50 text-foreground px-2"
                    >
                        {trigger}
                    </TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    )
}