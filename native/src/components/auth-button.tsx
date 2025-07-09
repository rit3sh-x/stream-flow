import { Button } from '@/components/ui/button';
import {
    SignedOut,
    SignInButton,
    SignUpButton
} from '@clerk/clerk-react';
import { dark } from "@clerk/themes"

export const AuthButton = () => {
    return (
        <SignedOut>
            <div className="flex gap-x-3 h-full justify-center items-center non-draggable">
                <SignInButton mode="modal" appearance={{
                    baseTheme: dark,
                    elements: {
                        modalCloseButton: "!cursor-pointer",
                        modalBackdrop: "!rounded-3xl"
                    }
                }}>
                    <Button
                        variant="outline"
                        className="z-50 px-10 rounded-full hover:bg-neutral-200"
                    >
                        Sign In
                    </Button>
                </SignInButton>

                <SignUpButton mode="modal" appearance={{
                    baseTheme: dark,
                    elements: {
                        modalCloseButton: "!cursor-pointer",
                        modalBackdrop: "!rounded-3xl"
                    }
                }}>
                    <Button
                        variant="default"
                        className="z-50 px-10 border rounded-full hover:bg-neutral-800"
                    >
                        Sign Up
                    </Button>
                </SignUpButton>
            </div>
        </SignedOut>
    );
};