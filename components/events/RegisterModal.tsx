"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Copy } from "lucide-react"
import type { PaymentSettingsData } from "@/lib/types/payment-settings"

interface RegisterModalProps {
    event: {
        _id: string
        title: string
        teamSize: number
        price: number
    }
    isOpen: boolean
    onClose: () => void
    onSuccess: (payload?: { message?: string; cashCode?: string; paymentMode: PaymentMode }) => void
    paymentSettings: PaymentSettingsData
}

type PaymentMode = "upi" | "cash"

const MAX_PROOF_SIZE_MB = 3

export function RegisterModal({ event, isOpen, onClose, onSuccess, paymentSettings }: RegisterModalProps) {
    const { user } = useUser()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const isTeamEvent = event.teamSize > 1
    const [teamName, setTeamName] = useState("")
    const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string; phone: string }>>([
        { name: "", email: "", phone: "" }
    ])
    const [paymentMode, setPaymentMode] = useState<PaymentMode>("upi")
    const [transactionReference, setTransactionReference] = useState("")
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null)
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
    const [upiCopied, setUpiCopied] = useState(false)

    const resolvedPaymentSettings = useMemo(() => {
        return {
            upiId: paymentSettings?.upiId?.trim() || "technohack@upi",
            receiverName: paymentSettings?.receiverName?.trim() || "TechnoHack Team",
            qrImageUrl: paymentSettings?.qrImageUrl || "",
            instructions:
                paymentSettings?.instructions?.trim() ||
                "Send the registration fee via UPI or cash and attach proof so admins can verify your payment."
        }
    }, [paymentSettings])

    const payableAmount = useMemo(() => {
        if (typeof event.price === "number" && Number.isFinite(event.price)) {
            return Math.max(event.price, 0)
        }
        return 0
    }, [event.price])

    useEffect(() => {
        if (!isOpen) return

        setError("")
        setLoading(false)
        setTeamName("")
        setTeamMembers([{ name: "", email: "", phone: "" }])
        setPaymentMode("upi")
        setTransactionReference("")
        setPaymentProofFile(null)
        setPaymentProofPreview(null)
        setUpiCopied(false)
    }, [isOpen, event.price])

    const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null

        if (!file) {
            setPaymentProofFile(null)
            setPaymentProofPreview(null)
            return
        }

        if (file.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
            setPaymentProofFile(null)
            setPaymentProofPreview(null)
            setError(`Proof image must be under ${MAX_PROOF_SIZE_MB}MB`)
            e.target.value = ""
            return
        }

        setError("")
        setPaymentProofFile(file)

        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPaymentProofPreview(reader.result)
            } else {
                setPaymentProofPreview(null)
            }
        }
        reader.onerror = () => {
            console.error("Failed to load payment proof preview", reader.error)
            setPaymentProofPreview(null)
            setError("Unable to preview the selected image")
        }
        reader.readAsDataURL(file)
    }

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result)
                } else {
                    reject(new Error("Failed to read file"))
                }
            }
            reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"))
            reader.readAsDataURL(file)
        })
    }

    const handleCopyUpiId = async () => {
        try {
            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(resolvedPaymentSettings.upiId)
                setUpiCopied(true)
                setTimeout(() => setUpiCopied(false), 2000)
            }
        } catch (copyError) {
            console.error("Unable to copy UPI ID", copyError)
        }
    }

    const addTeamMember = () => {
        if (teamMembers.length < event.teamSize - 1) {
            setTeamMembers([...teamMembers, { name: "", email: "", phone: "" }])
        }
    }

    const removeTeamMember = (index: number) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== index))
    }

    const updateTeamMember = (index: number, field: string, value: string) => {
        const updated = [...teamMembers]
        updated[index] = { ...updated[index], [field]: value }
        setTeamMembers(updated)
    }

    const resetForm = () => {
        setTeamName("")
        setTeamMembers([{ name: "", email: "", phone: "" }])
        setPaymentMode("upi")
        setTransactionReference("")
        setPaymentProofFile(null)
        setPaymentProofPreview(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError("")

        try {
            if (paymentMode === "upi" && !transactionReference.trim()) {
                setError("Add the UPI UTR/reference number so we can verify your payment")
                setLoading(false)
                return
            }

            let paymentProofBase64: string | undefined
            if (paymentProofFile) {
                paymentProofBase64 = paymentProofPreview ?? await fileToBase64(paymentProofFile)
            }

            const payload = {
                eventId: event._id,
                teamName: isTeamEvent ? teamName : undefined,
                teamMembers: isTeamEvent ? teamMembers.filter(m => m.name || m.email || m.phone) : undefined,
                paymentMode,
                transactionReference: paymentMode === "upi" ? transactionReference.trim() : undefined,
                paymentProof: paymentProofBase64
            }

            const response = await fetch("/api/events/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (response.ok && result.success) {
                resetForm()
                const generatedCashCode = result.registration?.cashCode
                const successMessage = paymentMode === "cash" && generatedCashCode
                    ? `Registration submitted! Your cash handover code is ${generatedCashCode}. Share it at the help desk when you pay.`
                    : "Registration submitted! We'll verify your payment shortly."
                onSuccess({
                    message: successMessage,
                    cashCode: paymentMode === "cash" ? generatedCashCode : undefined,
                    paymentMode
                })
                onClose()
                setTimeout(() => {
                    router.back()
                }, 200)
            } else {
                setError(result.message || result.error || "Registration failed")
            }
        } catch {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="relative bg-gradient-to-br from-[#0a0a0f] to-[#050508] rounded-lg border-2 border-cyan-500/30 p-8">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-950/50 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                                REGISTER
                            </h2>
                            <p className="text-gray-400">
                                {event.title} • {isTeamEvent ? `Team Event (${event.teamSize} members)` : 'Individual Event'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Team Name (for team events) */}
                            {isTeamEvent && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Team Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        required={isTeamEvent}
                                        className="w-full px-4 py-3 rounded-lg bg-[#0f0f14] border border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all"
                                        placeholder="Enter your team name"
                                    />
                                </div>
                            )}

                            {/* Team Members */}
                            {isTeamEvent && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-semibold text-gray-300">
                                            Team Members ({teamMembers.length}/{event.teamSize - 1} added)
                                        </label>
                                        {teamMembers.length < event.teamSize - 1 && (
                                            <button
                                                type="button"
                                                onClick={addTeamMember}
                                                className="px-3 py-1 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50 text-sm flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Member
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {teamMembers.map((member, index) => (
                                            <div key={index} className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/20">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-semibold text-purple-400">Member {index + 1}</span>
                                                    {teamMembers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTeamMember(index)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                                                        placeholder="Name"
                                                        className="px-3 py-2 rounded-lg bg-[#0f0f14] border border-purple-500/30 text-white text-sm focus:border-purple-400 outline-none"
                                                    />
                                                    <input
                                                        type="email"
                                                        value={member.email}
                                                        onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                                                        placeholder="Email"
                                                        className="px-3 py-2 rounded-lg bg-[#0f0f14] border border-purple-500/30 text-white text-sm focus:border-purple-400 outline-none"
                                                    />
                                                    <input
                                                        type="tel"
                                                        value={member.phone}
                                                        onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                                                        placeholder="Phone"
                                                        className="px-3 py-2 rounded-lg bg-[#0f0f14] border border-purple-500/30 text-white text-sm focus:border-purple-400 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Instructions */}
                            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-4">
                                <div className="flex flex-col gap-5 md:flex-row">
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-sm text-cyan-200 font-semibold">Pay via UPI</p>
                                            <p className="text-sm text-gray-300">
                                                Transfer the registration fee to <span className="text-white font-semibold">{resolvedPaymentSettings.receiverName}</span> using the UPI ID below or by scanning the QR code. Cash submissions are still accepted at the help desk.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-cyan-500/30 bg-black/30 px-4 py-3">
                                            <div className="flex-1 min-w-[200px]">
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">UPI ID</p>
                                                <p className="font-mono text-lg text-white">{resolvedPaymentSettings.upiId}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleCopyUpiId}
                                                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/10"
                                            >
                                                <Copy className="h-4 w-4" />
                                                {upiCopied ? "Copied" : "Copy"}
                                            </button>
                                        </div>
                                        {resolvedPaymentSettings.instructions && (
                                            <p className="text-xs text-gray-300">
                                                {resolvedPaymentSettings.instructions}
                                            </p>
                                        )}
                                        <ul className="list-disc space-y-1 pl-5 text-xs text-gray-400">
                                            <li>Complete the payment before submitting the form.</li>
                                            <li>Mention your name/event in the payment note.</li>
                                            <li>Enter the UTR / receipt number and upload a proof so admins can verify quickly.</li>
                                            <li>If you choose cash, submit the form and we&apos;ll generate a 6-digit handover code instantly.</li>
                                        </ul>
                                    </div>
                                    <div className="flex w-full flex-col items-center gap-2 md:w-48">
                                        {resolvedPaymentSettings.qrImageUrl ? (
                                            <>
                                                <div className="rounded-lg border border-white/10 bg-white p-3">
                                                    <Image
                                                        src={resolvedPaymentSettings.qrImageUrl}
                                                        alt="UPI QR code"
                                                        width={160}
                                                        height={160}
                                                        className="h-40 w-40 object-contain"
                                                        sizes="160px"
                                                        unoptimized
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-400">Scan & Pay</p>
                                            </>
                                        ) : (
                                            <div className="flex h-44 w-full items-center justify-center rounded-lg border border-dashed border-white/20 p-4 text-center text-[11px] text-gray-500">
                                                Ask an admin to upload a QR image in Payment Settings
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    We will mark your registration as confirmed after the finance/admin team verifies the payment details you submit below.
                                </p>
                            </div>

                            {/* Payment Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Payment Mode *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {["upi", "cash"].map(mode => (
                                        <button
                                            type="button"
                                            key={mode}
                                            onClick={() => setPaymentMode(mode as PaymentMode)}
                                            className={`py-3 rounded-lg border text-sm font-semibold transition-all ${paymentMode === mode ? "border-cyan-400 bg-cyan-500/10 text-cyan-200" : "border-white/10 text-gray-400 hover:border-cyan-500/40"}`}
                                        >
                                            {mode === "upi" ? "UPI Transfer" : "Cash Submission"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Paid */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Amount Due</label>
                                <div className="w-full px-4 py-3 rounded-lg bg-[#0f0f14] border border-cyan-500/30 text-white flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Event Price</span>
                                    <span className="text-2xl font-black text-cyan-300">₹{payableAmount.toFixed(2)}</span>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    This amount syncs directly with the event listing so participants can&apos;t edit it.
                                </p>
                            </div>

                            {/* Transaction Reference / Cash Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {paymentMode === "upi" ? "Transaction / Receipt Reference *" : "Cash Handover Code"}
                                </label>
                                {paymentMode === "upi" ? (
                                    <>
                                        <input
                                            type="text"
                                            value={transactionReference}
                                            onChange={e => setTransactionReference(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-[#0f0f14] border border-purple-500/30 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all"
                                            placeholder="UPI UTR / Ref Number"
                                        />
                                        <p className="mt-2 text-xs text-gray-400">
                                            Paste the exact UPI UTR/reference number so our finance team can match your transfer quickly.
                                        </p>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
                                        Submit the form and we&apos;ll auto-generate a 6-digit cash code. Show that code at the help desk when submitting your payment.
                                    </div>
                                )}
                            </div>

                            {/* Proof Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Payment Proof (optional)</label>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleProofChange}
                                        className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-200 hover:file:bg-cyan-500/30"
                                    />
                                    <p className="text-xs text-gray-400">Accepted formats: JPG/PNG, max {MAX_PROOF_SIZE_MB}MB.</p>
                                    {paymentProofPreview && (
                                        <div className="rounded-lg border border-white/10 overflow-hidden">
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={paymentProofPreview}
                                                    alt="Payment proof preview"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 600px"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Registration Fee */}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Registration Fee</span>
                                    <span className="text-2xl font-bold text-cyan-400">₹{event.price}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Registering..." : "Complete Registration"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
