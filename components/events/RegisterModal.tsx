"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Mail, Phone, Plus, Trash2 } from "lucide-react"
import { registerForEvent } from "@/lib/actions/registration.actions"

interface RegisterModalProps {
    event: {
        _id: string
        title: string
        teamSize: number
        price: number
    }
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function RegisterModal({ event, isOpen, onClose, onSuccess }: RegisterModalProps) {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const isTeamEvent = event.teamSize > 1
    const [teamName, setTeamName] = useState("")
    const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string; phone: string }>>([
        { name: "", email: "", phone: "" }
    ])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError("")

        try {
            const result = await registerForEvent({
                userId: user.id,
                eventId: event._id,
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.primaryEmailAddress?.emailAddress || "",
                teamName: isTeamEvent ? teamName : undefined,
                teamMembers: isTeamEvent ? teamMembers.filter(m => m.name && m.email) : undefined
            })

            if (result.success) {
                onSuccess()
                onClose()
            } else {
                setError(result.error || "Registration failed")
            }
        } catch (err) {
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
