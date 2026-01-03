"use client"

import Image from "next/image"
import { useMemo, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertTriangle, Check, CheckCircle2, Loader2, Pencil, User } from "lucide-react"
import { updateAdminProfileAction, type AdminProfileFormState } from "./actions"
import { cn } from "@/lib/utils"

type AdminProfileFormProps = {
    initialValues: {
        firstName: string
        lastName: string
        email: string
        role: string
        imageUrl: string
        phone: string
        college: string
        course: string
        year: string
        addressLine1: string
        addressLine2: string
        city: string
        state: string
        postalCode: string
        country: string
        bio: string
    }
}

const initialFormState: AdminProfileFormState = { status: "idle" }

const presetAvatars = [
    {
        id: "nebula",
        label: "Nebula Core",
        src: "/images/admin-avatars/avatar-1.png"
    },
    {
        id: "prism",
        label: "Prism Flux",
        src: "/images/admin-avatars/avatar-2.png"
    },
    {
        id: "circuit",
        label: "Circuit Pulse",
        src: "/images/admin-avatars/avatar-3.png"
    },
    {
        id: "aurora",
        label: "Aurora Frame",
        src: "/images/admin-avatars/avatar-4.png"
    }
] as const

export function AdminProfileForm({ initialValues }: AdminProfileFormProps) {
    const [state, formAction] = useActionState(updateAdminProfileAction, initialFormState)
    const [selectedAvatar, setSelectedAvatar] = useState(() => initialValues.imageUrl || presetAvatars[0].src)
    const [showAvatarPicker, setShowAvatarPicker] = useState(false)

    const initials = useMemo(() => {
        const first = initialValues.firstName?.[0] ?? ""
        const last = initialValues.lastName?.[0] ?? ""
        const fallback = initialValues.email?.[0] ?? "?"
        return `${first}${last}` || fallback.toUpperCase()
    }, [initialValues.firstName, initialValues.lastName, initialValues.email])

    return (
        <form action={formAction} className="space-y-8">
            {state.status === "success" && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    {state.message}
                </div>
            )}
            {state.status === "error" && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-200">
                    <AlertTriangle className="w-4 h-4" />
                    {state.message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-4">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="group relative w-32 h-32 rounded-full border border-white/10 overflow-hidden bg-gradient-to-br from-cyan-800/40 to-purple-800/40 flex items-center justify-center">
                            {selectedAvatar ? (
                                <Image
                                    src={selectedAvatar}
                                    alt="Profile avatar"
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-semibold text-white/70">{initials}</span>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowAvatarPicker((prev) => !prev)}
                                className="absolute bottom-3 right-3 inline-flex items-center justify-center rounded-full bg-black/70 p-2 text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100 hover:bg-black"
                                aria-label="Change avatar"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-400">
                            Hover to reveal the edit control and swap your avatar instantly.
                        </p>
                    </div>
                    {showAvatarPicker && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Choose avatar
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {presetAvatars.map((avatar) => {
                                    const isActive = selectedAvatar === avatar.src
                                    return (
                                        <button
                                            key={avatar.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedAvatar(avatar.src)
                                                setShowAvatarPicker(false)
                                            }}
                                            className={cn(
                                                "relative w-16 h-16 rounded-full border border-white/10 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60",
                                                isActive && "border-cyan-400"
                                            )}
                                            aria-label={`Use ${avatar.label}`}
                                        >
                                            <Image
                                                src={avatar.src}
                                                alt={avatar.label}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-black/30 grid place-items-center">
                                                    <Check className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    <input type="hidden" name="imageUrl" value={selectedAvatar} />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-6">
                    <SectionHeading title="Basic details" description="These values appear across the admin dashboard." />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="First name" name="firstName" defaultValue={initialValues.firstName} />
                        <InputField label="Last name" name="lastName" defaultValue={initialValues.lastName} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ReadOnlyField label="Email" value={initialValues.email} />
                        <ReadOnlyField label="Role" value={initialValues.role} />
                    </div>
                    <InputField label="Mobile number" name="phone" defaultValue={initialValues.phone} placeholder="e.g. +91 98765 43210" />
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-6">
                <SectionHeading title="Address" description="Shared with registration teams for contact and logistics." />
                <InputField label="Address line 1" name="addressLine1" defaultValue={initialValues.addressLine1} />
                <InputField label="Address line 2" name="addressLine2" defaultValue={initialValues.addressLine2} />
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="City" name="city" defaultValue={initialValues.city} />
                    <InputField label="State" name="state" defaultValue={initialValues.state} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="Postal code" name="postalCode" defaultValue={initialValues.postalCode} />
                    <InputField label="Country" name="country" defaultValue={initialValues.country} />
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-6">
                <SectionHeading title="Professional context" description="Optional details that help other admins know who is on duty." />
                <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="College / Organization" name="college" defaultValue={initialValues.college} />
                    <InputField label="Course" name="course" defaultValue={initialValues.course} />
                </div>
                <InputField label="Year" name="year" defaultValue={initialValues.year} />
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                        Bio / Notes
                    </label>
                    <textarea
                        name="bio"
                        defaultValue={initialValues.bio}
                        rows={4}
                        placeholder="Add a short blurb about your responsibilities, office hours, or communication preferences."
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end">
                <SaveButton />
            </div>
        </form>
    )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    )
}

function InputField({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                {label}
            </label>
            <input
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
            />
        </div>
    )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                {label}
            </label>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white/60 flex items-center gap-2">
                <User className="w-4 h-4 text-white/40" />
                <span className="truncate">{value}</span>
            </div>
        </div>
    )
}

function SaveButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={cn(
                "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,209,197,0.35)] transition",
                pending && "opacity-70"
            )}
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                </>
            ) : (
                "Save changes"
            )}
        </button>
    )
}
