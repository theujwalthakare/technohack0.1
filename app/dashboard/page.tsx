"use client"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import {
    Calendar,
    Trophy,
    Users as UsersIcon,
    Zap,
    ArrowRight,
    Clock,
    MapPin,
    Shield,
    BarChart3,
    FileText
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"

type DashboardStats = {
    total: number
    upcoming: number
    completed: number
    points: number
}

type RegistrationEntry = {
    _id: string
    status: string
    teamName?: string
    eventId?: {
        title: string
        category: string
        dateTime: string
        venue: string
    } | null
    paymentStatus?: string
    paymentMode?: "upi" | "cash"
    amountPaid?: number
    transactionReference?: string
    cashCode?: string
}

type DashboardResponse = {
    stats: DashboardStats
    registrations: RegistrationEntry[]
    role?: Role
    isAdmin?: boolean
}

type Role = "user" | "admin" | "superadmin"

type AdminOverview = {
    stats: {
        users: number
        events: number
        registrations: number
    }
    recentRegistrations: AdminRecentRegistration[]
}

type AdminRecentRegistration = {
    id: string
    eventTitle: string
    eventCategory: string
    userName: string
    userEmail: string
    status: string
    registeredAt: string
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
})

export default function DashboardPage() {
    const { user } = useUser()
    const [stats, setStats] = useState<DashboardStats>({ total: 0, upcoming: 0, completed: 0, points: 0 })
    const [registrations, setRegistrations] = useState<RegistrationEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<Role>("user")
    const [adminOverview, setAdminOverview] = useState<AdminOverview | null>(null)
    const [adminLoading, setAdminLoading] = useState(false)

    useEffect(() => {
        if (!user) return

        let isMounted = true

        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/me/registrations")
                if (!response.ok) {
                    throw new Error("Failed to load dashboard data")
                }
                const data = await response.json() as DashboardResponse
                if (isMounted) {
                    setStats(data.stats)
                    setRegistrations(data.registrations)
                    setRole(data.role ?? (data.isAdmin ? "admin" : "user"))
                }
            } catch (error) {
                console.error(error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [user])

    const isAdminView = role === "admin" || role === "superadmin"

    useEffect(() => {
        if (!isAdminView || adminOverview) return

        let isMounted = true
        setAdminLoading(true)

        fetch("/api/admin/overview")
            .then((response) => response.ok ? response.json() : null)
            .then((data: AdminOverview | null) => {
                if (!isMounted) return
                if (data) {
                    setAdminOverview(data)
                }
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                if (isMounted) {
                    setAdminLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [isAdminView, adminOverview])

    const statsCards = useMemo(() => ([
        { label: "Events Registered", value: stats.total.toString(), icon: Calendar, color: "from-cyan-500/10 to-blue-500/10", borderColor: "border-cyan-500/20" },
        { label: "Upcoming", value: stats.upcoming.toString(), icon: Clock, color: "from-purple-500/10 to-pink-500/10", borderColor: "border-purple-500/20" },
        { label: "Completed", value: stats.completed.toString(), icon: Trophy, color: "from-green-500/10 to-emerald-500/10", borderColor: "border-green-500/20" },
        { label: "Total Points", value: stats.points.toString(), icon: Zap, color: "from-orange-500/10 to-yellow-500/10", borderColor: "border-orange-500/20" }
    ]), [stats])

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 space-y-6">
                {isAdminView ? (
                    <AdminDashboardView
                        userName={user?.firstName ?? "Admin"}
                        overview={adminOverview}
                        loading={adminLoading}
                    />
                ) : (
                    <UserDashboardView
                        userName={user?.firstName ?? "Participant"}
                        userEmail={user?.primaryEmailAddress?.emailAddress ?? ""}
                        statsCards={statsCards}
                        registrations={registrations}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    )
}

function UserDashboardView({ userName, userEmail, statsCards, registrations, loading }: {
    userName: string
    userEmail: string
    statsCards: Array<{ label: string; value: string; icon: ComponentType<{ className?: string }>; color: string; borderColor: string }>
    registrations: RegistrationEntry[]
    loading: boolean
}) {
    return (
        <div className="space-y-6">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/5 bg-black/40 p-5"
            >
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/80 font-semibold mb-2">Participant Hub</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black font-orbitron text-white">Dashboard</h1>
                        <p className="text-gray-400 text-sm">Hello {userName}, keep tabs on your TechnoHack journey.</p>
                    </div>
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/90"
                    >
                        Browse Events
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statsCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="rounded-2xl border border-white/5 bg-[#05050c]/70 p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} grid place-items-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>

            <section className="space-y-4">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">My Events</p>
                        <h2 className="text-xl font-semibold text-white">Recent registrations</h2>
                    </div>
                    <Link href="/events" className="text-xs font-semibold text-cyan-300">View all</Link>
                </header>

                <div className="rounded-3xl border border-white/5 bg-black/40 divide-y divide-white/5">
                    {loading ? (
                        <div className="p-6 text-sm text-gray-400">Loading your events...</div>
                    ) : registrations.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                            Nothing yet. <Link href="/events" className="text-cyan-300 font-semibold">Browse events</Link>
                        </div>
                    ) : (
                        registrations.slice(0, 4).map((reg) => {
                            const event = reg.eventId
                            if (!event) return null
                            return (
                                <div key={reg._id} className="p-5 space-y-3 text-sm">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-white font-semibold">{event.title}</p>
                                            <p className="text-[12px] text-gray-400">{event.category}</p>
                                        </div>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                                            reg.status === "confirmed"
                                                ? "border-emerald-500/40 text-emerald-300"
                                                : reg.status === "pending"
                                                    ? "border-amber-500/40 text-amber-300"
                                                    : "border-rose-500/40 text-rose-300"
                                        }`}>
                                            {reg.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-[12px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                                            {new Date(event.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-purple-300" />
                                            {new Date(event.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-pink-300" />
                                            {event.venue}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-[11px] text-gray-400">
                                        <span>Mode: <span className="text-white">{reg.paymentMode === "cash" ? "Cash" : "UPI"}</span></span>
                                        <span>Status: <span className="text-white">{(reg.paymentStatus ?? "pending").toUpperCase()}</span></span>
                                        <span>Paid: <span className="text-white">{currencyFormatter.format(reg.amountPaid ?? 0)}</span></span>
                                    </div>
                                    {reg.paymentMode === "cash" && reg.cashCode && (
                                        <div className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-400/30 rounded-lg px-3 py-2 font-mono tracking-[0.3em]">
                                            {reg.cashCode}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-[#05050c]/60 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Profile</p>
                        <h3 className="text-lg font-semibold text-white mt-2">{userName}</h3>
                        <p className="text-[13px] text-gray-400">{userEmail}</p>
                        <Link href="/profile" className="mt-3 inline-flex text-xs font-semibold text-cyan-300">Edit profile →</Link>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#05050c]/60 p-4 space-y-2 text-sm text-gray-300">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Quick links</p>
                        <Link href="/schedule" className="block text-white/80">View live schedule</Link>
                        <Link href="/about" className="block text-white/80">About TechnoHack</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

function AdminDashboardView({ userName, overview, loading }: {
    userName: string
    overview: AdminOverview | null
    loading: boolean
}) {
    const stats = overview?.stats
    const recent = overview?.recentRegistrations ?? []

    const adminCards = [
        { label: "Users", value: stats ? stats.users.toString() : "--", icon: UsersIcon },
        { label: "Events", value: stats ? stats.events.toString() : "--", icon: Calendar },
        { label: "Registrations", value: stats ? stats.registrations.toString() : "--", icon: FileText }
    ]

    const adminLinks = [
        { href: "/admin", label: "Open Admin Panel", icon: Shield },
        { href: "/admin/events", label: "Manage Events", icon: Calendar },
        { href: "/admin/registrations", label: "View Registrations", icon: FileText },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
    ]

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-cyan-500/20 bg-[#03040b]/80 p-5 text-white space-y-3">
                <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-300/80">Admin Console</p>
                <h1 className="text-3xl font-black font-orbitron">Welcome, {userName}</h1>
                <p className="text-sm text-gray-400">Monitor the festival and jump into admin tools in one tap.</p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {adminCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="rounded-2xl border border-white/5 bg-black/50 p-4 text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 grid place-items-center">
                                <Icon className="w-5 h-5 text-cyan-200" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    )
                })}
            </section>

            <section className="rounded-3xl border border-white/5 bg-black/40 p-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                    {adminLinks.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/90"
                            >
                                <Icon className="w-4 h-4 text-cyan-300" />
                                {action.label}
                            </Link>
                        )
                    })}
                </div>
            </section>

            <section className="rounded-3xl border border-white/5 bg-black/40">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent Activity</p>
                        <h2 className="text-lg font-semibold text-white">Latest registrations</h2>
                    </div>
                    {loading && <span className="text-[11px] text-gray-400">Syncing</span>}
                </div>
                <div className="divide-y divide-white/5">
                    {recent.length === 0 ? (
                        <p className="p-5 text-sm text-gray-400">No registrations yet.</p>
                    ) : (
                        recent.map((entry) => (
                            <div key={entry.id} className="p-5 text-sm text-white/80 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-white">{entry.eventTitle}</p>
                                        <p className="text-xs text-gray-400">{entry.eventCategory}</p>
                                    </div>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-white/20 text-white/70">{entry.status}</span>
                                </div>
                                <p className="text-xs text-gray-400">{entry.userName} · {entry.userEmail}</p>
                                <p className="text-[11px] text-gray-500">{new Date(entry.registeredAt).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}
