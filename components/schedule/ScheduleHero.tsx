"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export function ScheduleHero() {
    return (
        <section className="relative min-h-[35vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Animated Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]"
                    style={{
                        animation: "gridPulse 8s ease-in-out infinite"
                    }}
                />
            </div>

            {/* Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-[100px] rounded-full" />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500"
                        style={{
                            textShadow: '0 0 30px rgba(6, 182, 212, 0.5)'
                        }}
                    >
                        EVENT SCHEDULE
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Plan your TechnoHack 2026 journey across two action-packed days
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm font-semibold text-white">January 08-09, 2026</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-950/30 border border-purple-500/30">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-semibold text-white">K.V.N. Naik College, Nashik</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
