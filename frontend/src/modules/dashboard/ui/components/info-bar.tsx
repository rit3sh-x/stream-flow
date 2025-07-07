"use client";

import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import { dark } from '@clerk/themes';
import React from 'react'
import { useCurrentTheme } from '@/hooks/use-current-theme';

export const InfoBar = () => {
    const currentTheme = useCurrentTheme();

    return (
        <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md p-4 flex items-center justify-between gap-4 pr-8">
            <div className="flex justify-center backdrop-blur-md items-center border-2 rounded-full px-4 w-full max-w-lg">
                <Search
                    size={25}
                    className="text-muted-foreground"
                />
                <Input
                    className="!bg-transparent !border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="Search for people, projects, tags & folders"
                />
            </div>
            <UserButton
                appearance={{
                    elements: {
                        cardBox: "border! shadow-none! rounded-lg!"
                    },
                    baseTheme: currentTheme === "dark" ? dark : undefined,
                }}
            />
        </header>
    )
}