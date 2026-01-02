"use client"

import { motion } from "framer-motion"
import { Target, Eye, Building2 } from "lucide-react"

const cards = [
    {
        icon: Building2,
        title: "About Coderminds",
        description: "A student-driven technical initiative under the Department of Computer Science that regularly organizes technical events, hackathons, workshops, and competitions aimed at bridging academic learning with industry-relevant skills."
    },
    {
        icon: Target,
        title: "Our Mission",
        description: "To foster a culture of technical excellence, innovation, problem-solving, and leadership among students through hands-on competitions and collaborative learning experiences."
    },
    {
        icon: Eye,
        title: "Our Vision",
        description: "To create a future-ready student community capable of solving real-world challenges using technology, creativity, and entrepreneurial thinking."
    }
]

export function MissionVision() {
    return (
        <section className="py-12 bg-background">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon
                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 to-purple-950/30 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all" />

                                {/* Grid Pattern Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 rounded-lg" />

                                <div className="relative p-6 space-y-3">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                                        <Icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <h3 className="text-xl font-bold font-orbitron text-white">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
