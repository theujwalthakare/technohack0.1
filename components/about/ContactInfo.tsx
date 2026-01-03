"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, Building2 } from "lucide-react"

const contactDetails = [
    {
        icon: Building2,
        label: "Institution",
        value: "Kr. V. N. Naik Arts, Commerce & Science College"
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Canada Corner, Nashik, Maharashtra"
    },
    {
        icon: Calendar,
        label: "Event Dates",
        value: "January 08-09, 2026"
    },
    {
        icon: Building2,
        label: "Department",
        value: "Computer Science / BCA / BBA / BBA-CA"
    }
]

export function ContactInfo() {
    return (
        <section className="py-12 bg-background">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-black font-orbitron text-white mb-2">
                        Get In Touch
                    </h2>
                    <p className="text-gray-400">
                        Join us for two days of innovation and competition
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {contactDetails.map((detail, index) => {
                        const Icon = detail.icon
                        return (
                            <motion.div
                                key={detail.label}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Card Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 to-purple-950/20 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all" />

                                <div className="relative p-5 flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                            {detail.label}
                                        </div>
                                        <div className="text-base font-semibold text-white">
                                            {detail.value}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Organizing by Coderminds */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/20">
                        <p className="text-sm text-gray-400">
                            Organized by{" "}
                            <span className="text-cyan-400 font-bold font-orbitron">
                                CODERMINDS
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
