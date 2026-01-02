"use client"

import { motion } from "framer-motion"
import { Users, Trophy, Calendar, Layers } from "lucide-react"

const stats = [
    { icon: Users, value: "300+", label: "Participants" },
    { icon: Trophy, value: "10", label: "Events" },
    { icon: Calendar, value: "2", label: "Days" },
    { icon: Layers, value: "12", label: "Committees" }
]

export function QuickStats() {
    return (
        <section className="py-12 bg-gradient-to-b from-background to-cyan-950/10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-3 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div className="text-3xl md:text-4xl font-black font-orbitron text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
