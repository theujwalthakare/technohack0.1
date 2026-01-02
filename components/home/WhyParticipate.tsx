"use client"

import { motion } from "framer-motion"
import { Brain, Award, Users, Star, Gift } from "lucide-react"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { homePageData } from "@/lib/config/homePageData"

const iconMap = {
    brain: Brain,
    award: Award,
    users: Users,
    star: Star,
    gift: Gift
}

export function WhyParticipate() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-background to-purple-950/10">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    title="Why Participate?"
                    subtitle="More than just competition — it's an experience"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {homePageData.benefits.map((benefit, index) => {
                        const Icon = iconMap[benefit.icon as keyof typeof iconMap]

                        return (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-6 rounded-lg bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold font-orbitron text-white mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
