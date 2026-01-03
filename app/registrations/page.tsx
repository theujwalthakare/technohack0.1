import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUserRegistrations, getUserStats } from "@/lib/actions/registration.actions"
import { PageContainer } from "@/components/shared/PageContainer"
import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
})

type RegistrationWithEvent = {
    _id: string
    status: string
    paymentMode?: "cash" | "upi"
    paymentStatus?: string
    amountPaid?: number
    teamName?: string
    eventId?: {
        _id: string
        title: string
        dateTime: string
        venue: string
        slug: string
        whatsappLink?: string
        price?: number
    } | null
}

export default async function RegistrationsPage() {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in")
    }

    const [registrations, stats] = await Promise.all([
        getUserRegistrations(userId),
        getUserStats(userId)
    ])

    const totalDue = registrations.reduce((sum, reg) => sum + (reg.amountPaid ?? 0), 0)

    return (
        <div className="pb-16">
            <PageContainer className="py-10 space-y-8">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#07121f] via-[#0e1a33] to-[#1a0f2b] p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">My cart</p>
                            <h1 className="text-3xl sm:text-4xl font-black font-orbitron">Registered events</h1>
                            <p className="text-sm text-white/70 mt-2">Track every event you have locked in, view payment modes, and jump back into the details instantly.</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-sm text-white/80">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Summary</p>
                            <p className="text-2xl font-black text-white mt-1">{stats.total} events</p>
                            <p className="text-white/60">Total fees tagged: {currencyFormatter.format(totalDue)}</p>
                        </div>
                    </div>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[{
                        label: "Upcoming",
                        value: stats.upcoming,
                        icon: Calendar,
                        accent: "text-cyan-300"
                    }, {
                        label: "Completed",
                        value: stats.completed,
                        icon: Clock,
                        accent: "text-purple-300"
                    }, {
                        label: "Points",
                        value: stats.points,
                        icon: ArrowRight,
                        accent: "text-amber-300"
                    }, {
                        label: "Total paid",
                        value: currencyFormatter.format(totalDue),
                        icon: MapPin,
                        accent: "text-emerald-300"
                    }].map((card) => {
                        const Icon = card.icon
                        return (
                            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white/80">
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ${card.accent}`}>
                                        <Icon className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">{card.label}</p>
                                        <p className="text-xl font-semibold text-white">{card.value}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </section>

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Current lineup</p>
                            <h2 className="text-xl font-semibold text-white">Your registrations</h2>
                        </div>
                        <Link href="/events" className="text-xs font-semibold text-cyan-300">Browse more events →</Link>
                    </div>

                    {registrations.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/70">
                            <p className="font-semibold">No events yet.</p>
                            <p className="text-sm text-white/50">Head to the events page and add your first registration.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {registrations.map((registration) => {
                                const event = registration.eventId
                                if (!event) return null
                                const dateLabel = event.dateTime ? new Date(event.dateTime).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit"
                                }) : "TBA"
                                const statusTone = registration.status === "confirmed"
                                    ? "text-emerald-300 border-emerald-500/40"
                                    : registration.status === "pending"
                                        ? "text-amber-300 border-amber-500/40"
                                        : "text-rose-300 border-rose-500/40"

                                return (
                                    <div key={registration._id} className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white/80">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-lg font-semibold text-white">{event.title}</p>
                                                <p className="text-sm text-white/60">{dateLabel} · {event.venue}</p>
                                            </div>
                                            <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${statusTone}`}>
                                                {registration.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-white/70">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Payment mode</p>
                                                <p className="font-semibold text-white">{registration.paymentMode === "cash" ? "Cash" : "UPI"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Amount</p>
                                                <p className="font-semibold text-white">{currencyFormatter.format(registration.amountPaid ?? 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Payment status</p>
                                                <p className="font-semibold text-white">{registration.paymentStatus ?? "pending"}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                            <Link
                                                href={`/events/${event.slug}`}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-white/80 hover:text-white"
                                            >
                                                View event
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                            {event.whatsappLink && (
                                                <a
                                                    href={event.whatsappLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-[#25D366]"
                                                >
                                                    Join WhatsApp
                                                    <ArrowRight className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </PageContainer>
        </div>
    )
}
