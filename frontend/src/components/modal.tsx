import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import React from 'react'

type Props = {
    trigger: React.ReactNode
    children: React.ReactNode
    title: string
    description: string
    className?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export const Modal = ({ children, description, title, trigger, className, open, onOpenChange }: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger
                className={className}
                asChild
            >
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}