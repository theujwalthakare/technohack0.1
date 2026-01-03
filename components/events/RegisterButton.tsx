"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { RegisterModal } from "@/components/events/RegisterModal"
import type { PaymentSettingsData } from "@/lib/types/payment-settings"
import { cn } from "@/lib/utils"

type RegisterableEvent = {
    _id: string;
    title: string;
    teamSize: number;
    price: number;
}

interface RegisterButtonProps {
    event: RegisterableEvent;
    isRegistered: boolean;
    paymentSettings: PaymentSettingsData;
    className?: string;
    variant?: "default" | "compact";
    buttonLabel?: string;
}

export function RegisterButton({
    event,
    isRegistered,
    paymentSettings,
    className,
    variant = "default",
    buttonLabel
}: RegisterButtonProps) {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [successDetails, setSuccessDetails] = useState<{
        message: string;
        cashCode?: string;
        paymentMode?: "upi" | "cash";
    } | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const isCompact = variant === "compact";
    const resolvedButtonLabel = buttonLabel ?? "Register & Share Payment";
    const containerClasses = cn(isCompact ? "space-y-0" : "space-y-2", className);
    const activeButtonClasses = isCompact
        ? "w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-sm py-3 rounded-xl shadow-[0_10px_35px_rgba(99,102,241,0.35)]"
        : "w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]";
    const disabledButtonClasses = isCompact
        ? "w-full bg-green-500/20 text-green-100 border border-green-500/40 font-semibold py-3 rounded-xl cursor-not-allowed"
        : "w-full bg-green-500/20 text-green-500 border border-green-500/50 font-bold py-3 rounded-lg cursor-not-allowed";

    const handleClick = () => {
        if (!isSignedIn) {
            router.push("/sign-in");
            return;
        }

        setIsModalOpen(true);
    }

    const handleSuccess = (payload?: { message?: string; cashCode?: string; paymentMode: "upi" | "cash" }) => {
        setHasSubmitted(true);
        if (payload) {
            setSuccessDetails({
                message: payload.message ?? "Registration submitted! We'll confirm after verifying your payment.",
                cashCode: payload.cashCode,
                paymentMode: payload.paymentMode
            });
        } else {
            setSuccessDetails({ message: "Registration submitted! We'll confirm after verifying your payment." });
        }
        setIsToastVisible(true);
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    const renderToast = () => {
        if (!successDetails || !isToastVisible) return null;
        return (
            <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-6">
                <button
                    type="button"
                    className="absolute inset-0 bg-black/20"
                    aria-label="Dismiss success message"
                    onClick={() => setIsToastVisible(false)}
                />
                <div
                    className="relative max-w-md w-full rounded-2xl border border-cyan-500/40 bg-[#030308]/95 backdrop-blur-lg p-4 shadow-[0_10px_40px_rgba(6,182,212,0.3)]"
                    onClick={event => event.stopPropagation()}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-white">{successDetails.message}</p>
                            {successDetails.paymentMode === "cash" && successDetails.cashCode && (
                                <p className="text-xs text-amber-200 mt-2">Cash code:
                                    <span className="ml-2 font-mono text-lg text-white tracking-[0.4em] bg-black/40 px-2 py-1 rounded">
                                        {successDetails.cashCode}
                                    </span>
                                </p>
                            )}
                            {successDetails.paymentMode === "upi" && (
                                <p className="text-xs text-gray-300 mt-2">Keep your UPI reference handy while we verify.</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsToastVisible(false)}
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isRegistered || hasSubmitted) {
        if (isCompact) {
            return (
                <>
                    {renderToast()}
                    <button disabled className={disabledButtonClasses}>
                        {isRegistered ? "Registered" : "Submitted"}
                    </button>
                </>
            )
        }

        return (
            <>
                {renderToast()}
                <div className="space-y-4">
                    <button disabled className={disabledButtonClasses}>
                        {isRegistered ? "Already Registered" : "Payment Submitted"}
                    </button>
                    {successDetails && (
                        <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-100 space-y-2">
                            <p className="font-semibold text-white">{successDetails.message}</p>
                            {successDetails.paymentMode === "cash" && successDetails.cashCode && (
                                <div className="rounded-xl border border-amber-400/60 bg-amber-500/10 px-4 py-3 text-center">
                                    <p className="text-[11px] uppercase tracking-[0.4em] text-amber-200">Cash Code</p>
                                    <p className="text-3xl font-black font-mono text-white tracking-[0.3em]">{successDetails.cashCode}</p>
                                    <p className="text-xs text-amber-100/80 mt-1">Save this code and show it at the help desk during payment.</p>
                                </div>
                            )}
                            {successDetails.paymentMode === "upi" && (
                                <p className="text-xs text-green-100/70">Keep your UPI reference handy until the finance team finishes verification.</p>
                            )}
                        </div>
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            {renderToast()}
            <div className={containerClasses}>
                <button
                    onClick={handleClick}
                    className={activeButtonClasses}
                >
                    {resolvedButtonLabel}
                </button>
            <RegisterModal
                event={event}
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
                paymentSettings={paymentSettings}
            />
            </div>
        </>
    )
}
