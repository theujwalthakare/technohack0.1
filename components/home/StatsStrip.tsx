"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Building2, Calendar } from "lucide-react"
import { homePageData } from "@/lib/config/homePageData"

const iconMap = {
    trophy: Trophy,
    award: Award,
    building: Building2,
    calendar: Calendar
}

export function StatsStrip() {
    return (
        <section className="py-16 bg-gradient-to-b from-background to-cyan-950/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {homePageData.stats.map((stat, index) => {
                        const Icon = iconMap[stat.icon as keyof typeof iconMap]
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black font-orbitron text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider">
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
