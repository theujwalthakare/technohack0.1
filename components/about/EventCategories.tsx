"use client"

import { motion } from "framer-motion"
import { Code, Brain, Globe, Shield, Gamepad2, Briefcase, Film } from "lucide-react"

const categories = [
    { icon: Code, name: "Technical & Coding", color: "from-cyan-500/20 to-blue-500/20", borderColor: "border-cyan-500/30" },
    { icon: Brain, name: "AI & Innovation", color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
    { icon: Globe, name: "Web Development", color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
    { icon: Shield, name: "Cyber & Logic", color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/30" },
    { icon: Gamepad2, name: "Gaming", color: "from-yellow-500/20 to-amber-500/20", borderColor: "border-yellow-500/30" },
    { icon: Briefcase, name: "Business & Management", color: "from-indigo-500/20 to-violet-500/20", borderColor: "border-indigo-500/30" },
    { icon: Film, name: "Creative Media", color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-500/30" }
]

export function EventCategories() {
    return (
        <section className="py-12 bg-gradient-to-b from-cyan-950/10 to-background">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-black font-orbitron text-white mb-2">
                        Event Categories
                    </h2>
                    <p className="text-gray-400">
                        10 exciting events across 6 diverse categories
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group"
                            >
                                <div className={`relative p-4 rounded-lg bg-gradient-to-br ${category.color} border ${category.borderColor} hover:scale-105 transition-transform`}>
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <Icon className="w-6 h-6 text-white" />
                                        <span className="text-xs font-bold text-white leading-tight">
                                            {category.name}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
