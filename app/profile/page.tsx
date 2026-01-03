import { getCurrentUserProfile } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { ProfileForm } from "./ProfileForm"
import { CheckCircle2, CircleDashed, Sparkles } from "lucide-react"
import { MobileActionBar } from "@/components/shared/MobileActionBar"

export default async function ProfilePage() {
    const profile = await getCurrentUserProfile()

    if (!profile) {
        redirect("/sign-in")
    }

    const initialValues = {
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        imageUrl: profile.imageUrl ?? "",
        phone: profile.phone ?? "",
        college: profile.college ?? "",
        course: profile.course ?? "",
        year: profile.year ?? "",
        addressLine1: profile.addressLine1 ?? "",
        addressLine2: profile.addressLine2 ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        postalCode: profile.postalCode ?? "",
        country: profile.country ?? "",
        bio: profile.bio ?? ""
    }

    const completionSections = [
        {
            label: "Identity",
            description: "Name + avatar",
            complete: Boolean(profile.firstName && profile.lastName && profile.imageUrl)
        },
        {
            label: "Contact",
            description: "Phone & bio",
            complete: Boolean(profile.phone && profile.bio)
        },
        {
            label: "Campus",
            description: "College, course, year",
            complete: Boolean(profile.college && profile.course && profile.year)
        },
        {
            label: "Location",
            description: "Address + city",
            complete: Boolean(profile.addressLine1 && profile.city && profile.state && profile.postalCode)
        }
    ]

    const completedSections = completionSections.filter((section) => section.complete).length
    const completionPercent = Math.round((completedSections / completionSections.length) * 100)
    const nextFocus = completionSections.find((section) => !section.complete)?.label ?? "All sections ready"

    return (
        <div className="space-y-8 pb-20">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#08111d] via-[#101735] to-[#1a0d2b] p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#5eead4_0%,transparent_55%)] opacity-40" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Manage identity</p>
                        <h1 className="text-3xl sm:text-4xl font-black font-orbitron text-white">Your participant profile</h1>
                        <p className="text-sm text-white/70 max-w-2xl">
                            Keep contact info, campus details, and your public avatar polished. Updates sync instantly across the dashboard, registrations, and future schedules.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-sm text-white/80 space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Profile health</p>
                        <div className="flex items-center gap-2 text-white text-2xl font-bold">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            {completionPercent}%
                        </div>
                        <p className="text-white/60 text-xs">Next up: {nextFocus}</p>
                    </div>
                </div>
                <div className="relative mt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-white/70">
                        <span>Progress</span>
                        <span>{completedSections}/{completionSections.length} sections</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                            style={{ width: `${Math.max(completionPercent, 4)}%` }}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Checklist</p>
                        <h2 className="text-xl font-semibold text-white">Cover the essentials</h2>
                    </div>
                    <p className="text-sm text-white/60">Finish the remaining cards to breeze through event registrations.</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {completionSections.map((section) => (
                        <div key={section.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-start gap-3">
                            {section.complete ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                            ) : (
                                <CircleDashed className="w-5 h-5 text-white/40" />
                            )}
                            <div>
                                <p className="text-sm font-semibold text-white">{section.label}</p>
                                <p className="text-xs text-white/60">{section.description}</p>
                                {!section.complete && (
                                    <p className="text-[11px] text-amber-300 mt-1">Tap the form below to complete</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <ProfileForm initialValues={initialValues} />

            <MobileActionBar
                title="Need to jump back in?"
                subtitle="Preview your updates on the dashboard or discover fresh events."
                actions={[
                    { label: "Return to dashboard", href: "/dashboard" },
                    { label: "Browse events", href: "/events", variant: "secondary" }
                ]}
            />
        </div>
    )
}
