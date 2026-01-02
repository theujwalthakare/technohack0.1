"use client"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Calendar, Trophy, User, Zap, ArrowRight, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserRegistrations, getUserStats } from "@/lib/actions/registration.actions"

export default function DashboardPage() {
    const { user } = useUser()
    const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, points: 0 })
    const [registrations, setRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadData()
        }
    }, [user])

    const loadData = async () => {
        if (!user) return

        setLoading(true)
        const [userStats, userRegs] = await Promise.all([
            getUserStats(user.id),
            getUserRegistrations(user.id)
        ])

        setStats(userStats)
        setRegistrations(userRegs)
        setLoading(false)
    }

    const statsCards = [
        { label: "Events Registered", value: stats.total.toString(), icon: Calendar, color: "from-cyan-500/20 to-blue-500/20", borderColor: "border-cyan-500/30" },
        { label: "Upcoming Events", value: stats.upcoming.toString(), icon: Clock, color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
        { label: "Completed", value: stats.completed.toString(), icon: Trophy, color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
        { label: "Total Points", value: stats.points.toString(), icon: Zap, color: "from-orange-500/20 to-yellow-500/20", borderColor: "border-orange-500/30" }
    ]

    return (
        <div className="min-h-screen bg-background py-20">
            {/* Background Effects */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                                style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
                            >
                                DASHBOARD
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Welcome back, <span className="text-cyan-400 font-bold">{user?.firstName || 'Participant'}</span>
                            </p>
                        </div>
                        <Link
                            href="/events"
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center gap-2"
                        >
                            Browse Events
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-lg border ${stat.borderColor} group-hover:border-opacity-60 transition-all`} />
                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} border ${stat.borderColor} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-3xl font-black font-orbitron text-white">
                                            {stat.value}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* My Events - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold font-orbitron text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                    My Events
                                </h2>
                                <Link href="/events" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1">
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-12 text-gray-400">Loading your events...</div>
                                ) : registrations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 mb-4">No events registered yet</p>
                                        <Link href="/events" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                                            Browse Events →
                                        </Link>
                                    </div>
                                ) : (
                                    registrations.map((reg, index) => {
                                        const event = reg.eventId
                                        if (!event) return null

                                        return (
                                            <motion.div
                                                key={reg._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all" />
                                                <div className="relative p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                                            <p className="text-sm text-purple-400">{event.category}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${reg.status === 'confirmed'
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                                : reg.status === 'pending'
                                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}>
                                                            {reg.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-cyan-400" />
                                                            {new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-purple-400" />
                                                            {new Date(event.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-pink-400" />
                                                            {event.venue}
                                                        </div>
                                                    </div>
                                                    {reg.teamName && (
                                                        <div className="mt-3 pt-3 border-t border-cyan-500/20">
                                                            <p className="text-sm text-cyan-400">Team: {reg.teamName}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar - Profile & Quick Actions */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 to-pink-950/30 rounded-lg border border-purple-500/20" />
                            <div className="relative p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                                        {user?.firstName?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</h3>
                                        <p className="text-sm text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block w-full py-2 px-4 rounded-lg bg-purple-950/30 border border-purple-500/30 text-center text-white hover:bg-purple-950/50 hover:border-purple-500/50 transition-all"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 rounded-lg border border-cyan-500/20" />
                            <div className="relative p-6">
                                <h3 className="text-lg font-bold font-orbitron text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/events" className="block p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-500/40 text-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-cyan-400" />
                                            <span className="font-semibold">Browse Events</span>
                                        </div>
                                    </Link>
                                    <Link href="/schedule" className="block p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/40 text-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-purple-400" />
                                            <span className="font-semibold">View Schedule</span>
                                        </div>
                                    </Link>
                                    <Link href="/about" className="block p-3 rounded-lg bg-pink-950/20 border border-pink-500/20 hover:border-pink-500/40 text-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-pink-400" />
                                            <span className="font-semibold">About Event</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
