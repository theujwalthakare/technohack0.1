"use client"

import { registerForEvent } from "@/lib/actions/user.actions"
import { useTransition, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface RegisterButtonProps {
    eventId: string;
    isRegistered: boolean;
}

export function RegisterButton({ eventId, isRegistered }: RegisterButtonProps) {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    const handleRegister = () => {
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }

        startTransition(async () => {
            try {
                const res = await registerForEvent(eventId);
                if (res.success) {
                    setMessage("Successfully Registered!");
                } else {
                    setMessage(res.message);
                }
            } catch (error) {
                setMessage("Something went wrong");
            }
        });
    }

    if (isRegistered || message === "Successfully Registered!") {
        return (
            <button disabled className="w-full bg-green-500/20 text-green-500 border border-green-500/50 font-bold py-3 rounded-lg cursor-not-allowed">
                Already Registered
            </button>
        )
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleRegister}
                disabled={isPending}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
                {isPending ? "Registering..." : "Register Now"}
            </button>
            {message && <p className="text-sm text-red-400 text-center">{message}</p>}
        </div>
    )
}
