"use client"

import Image from "next/image"
import { useMemo, useState, useTransition } from "react"
import type { FormEvent } from "react"
import { AlertTriangle, ArrowRight, Check, CheckCircle2, Loader2, Pencil, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateParticipantProfileAction, type ParticipantProfileFormState } from "./actions"

type ProfileFormProps = {
    initialValues: {
        firstName: string
        lastName: string
        email: string
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

const presetAvatars = [
    { id: "nebula", label: "Nebula Core", src: "/images/admin-avatars/avatar-1.png" },
    { id: "prism", label: "Prism Flux", src: "/images/admin-avatars/avatar-2.png" },
    { id: "circuit", label: "Circuit Pulse", src: "/images/admin-avatars/avatar-3.png" },
    { id: "aurora", label: "Aurora Frame", src: "/images/admin-avatars/avatar-4.png" }
] as const

const initialFormState: ParticipantProfileFormState = { status: "idle" }

export function ProfileForm({ initialValues }: ProfileFormProps) {
    const [state, setState] = useState(initialFormState)
    const defaultAvatar = initialValues.imageUrl || presetAvatars[0].src
    const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar)
    const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [isPending, startTransition] = useTransition()

    const initials = useMemo(() => {
        const first = initialValues.firstName?.[0] ?? ""
        const last = initialValues.lastName?.[0] ?? ""
        const fallback = initialValues.email?.[0] ?? "?"
        return `${first}${last}` || fallback.toUpperCase()
    }, [initialValues.firstName, initialValues.lastName, initialValues.email])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        setState({ status: "idle" })

        startTransition(() => {
            updateParticipantProfileAction(formData)
                .then((result) => {
                    setState(result)
                })
                .catch((error) => {
                    console.error(error)
                    setState({ status: "error", message: "Failed to update profile." })
                })
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-5">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Identity</p>
                        <h2 className="text-xl font-semibold text-white">Avatar & presence</h2>
                        <p className="text-sm text-gray-400">Swap between curated presets that feel balanced across cards, leaderboards, and the dashboard hero.</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="group relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                            {selectedAvatar ? (
                                <Image src={selectedAvatar} alt="Profile avatar" fill sizes="128px" className="object-cover" />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/80">
                                    {initials}
                                </span>
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
                        <p className="text-[11px] text-gray-400 text-center">Hover to reveal edit controls and refresh your vibe.</p>
                        {showAvatarPicker && (
                            <div className="w-full space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 text-center">Choose avatar</p>
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
                                                <Image src={avatar.src} alt={avatar.label} fill sizes="64px" className="object-cover" />
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-black/30 grid place-items-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <input type="hidden" name="imageUrl" value={selectedAvatar} />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-6">
                    <SectionHeading title="Basic details" description="Updates reflect across the participant dashboard." />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="First name" name="firstName" defaultValue={initialValues.firstName} autoComplete="given-name" />
                        <InputField label="Last name" name="lastName" defaultValue={initialValues.lastName} autoComplete="family-name" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ReadOnlyField label="Email" value={initialValues.email} icon={User} />
                        <InputField label="Mobile number" name="phone" defaultValue={initialValues.phone} placeholder="e.g. +91 98765 43210" autoComplete="tel" />
                    </div>
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Short bio</label>
                        <textarea
                            name="bio"
                            defaultValue={initialValues.bio}
                            rows={4}
                            placeholder="Tell people what you are exploring this season."
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-5">
                    <SectionHeading title="Campus & track" description="Helps mentors pair you with relevant challenges." />
                    <div className="grid gap-4">
                        <InputField label="College / Organization" name="college" defaultValue={initialValues.college} autoComplete="organization" />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField label="Course" name="course" defaultValue={initialValues.course} />
                            <InputField label="Year" name="year" defaultValue={initialValues.year} />
                        </div>
                    </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#05050a]/80 p-6 space-y-5">
                    <SectionHeading title="Location" description="Only shared with registration desks for logistics updates." />
                    <InputField label="Address line 1" name="addressLine1" defaultValue={initialValues.addressLine1} autoComplete="address-line1" />
                    <InputField label="Address line 2" name="addressLine2" defaultValue={initialValues.addressLine2} autoComplete="address-line2" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="City" name="city" defaultValue={initialValues.city} autoComplete="address-level2" />
                        <InputField label="State" name="state" defaultValue={initialValues.state} autoComplete="address-level1" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="Postal code" name="postalCode" defaultValue={initialValues.postalCode} autoComplete="postal-code" />
                        <InputField label="Country" name="country" defaultValue={initialValues.country} autoComplete="country-name" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-[#122130] to-[#1c0f2a] px-6 py-5">
                <div className="space-y-1 text-sm text-white/80">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Preview</p>
                    <p className="font-semibold text-white">Changes go live instantly on your dashboard and registration cards.</p>
                    <p className="text-white/60">Use this page on mobile or desktop – elements stack neatly for both.</p>
                </div>
                <SaveButton pending={isPending} />
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

function InputField({ label, name, defaultValue, placeholder, autoComplete }: {
    label: string
    name: string
    defaultValue?: string
    placeholder?: string
    autoComplete?: string
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</label>
            <input
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
            />
        </div>
    )
}

function ReadOnlyField({ label, value, icon: Icon }: { label: string; value: string; icon: typeof User }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white/70">
                <Icon className="w-4 h-4 text-white/40" />
                <span className="truncate">{value}</span>
            </div>
        </div>
    )
}

function SaveButton({ pending }: { pending: boolean }) {
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                </>
            ) : (
                <>
                    Save profile
                    <ArrowRight className="h-4 w-4" />
                </>
            )}
        </button>
    )
}
