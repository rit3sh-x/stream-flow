import React from 'react'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

type Props = {
    title: string
    description: string
    children?: React.ReactNode
    footer?: React.ReactNode
}

export const GlobalCard = ({ title, children, description, footer }: Props) => {
    return (
        <Card className="bg-transparent mt-4 w-full">
            <CardHeader>
                <CardTitle className="text-md text-foreground">{title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                    {description}
                </CardDescription>
            </CardHeader>
            {children && <div className="p-4">{children}</div>}
            {footer && <CardFooter className="p-4">{footer}</CardFooter>}
        </Card>
    )
}