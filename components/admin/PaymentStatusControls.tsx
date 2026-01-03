"use client"

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { updateRegistrationPaymentStatus, type PaymentStatus } from "@/lib/actions/admin.actions"

const STATUS_OPTIONS: Array<{ value: PaymentStatus; label: string }> = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
]

interface PaymentStatusControlsProps {
    registrationId: string
    paymentStatus: PaymentStatus
}

export function PaymentStatusControls({ registrationId, paymentStatus }: PaymentStatusControlsProps) {
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(paymentStatus)
    const [currentStatus, setCurrentStatus] = useState<PaymentStatus>(paymentStatus)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (selectedStatus === currentStatus) {
            setFeedback("No changes to apply")
            return
        }

        startTransition(async () => {
            const result = await updateRegistrationPaymentStatus({
                registrationId,
                paymentStatus: selectedStatus
            })

            if (result.success) {
                setCurrentStatus(selectedStatus)
                setFeedback("Payment status updated")
            } else {
                setFeedback(result.message ?? "Update failed")
            }
        })
    }

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as PaymentStatus)
        setFeedback(null)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2 text-xs text-gray-300">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-gray-500">
                <span>Review Payment</span>
                {feedback && <span className="text-cyan-200 tracking-normal">{feedback}</span>}
            </div>
            <div className="flex gap-2">
                <select
                    value={selectedStatus}
                    onChange={handleSelectChange}
                    className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={isPending || selectedStatus === currentStatus}
                    className="inline-flex items-center justify-center rounded-lg border border-cyan-500/40 px-3 py-2 font-semibold text-white transition-all disabled:opacity-40"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <span>Save</span>
                    )}
                </button>
            </div>
        </form>
    )
}
