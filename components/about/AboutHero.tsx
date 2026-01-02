"use client"

import { motion } from "framer-motion"
import { ParticleBackground } from "@/components/effects/ParticleBackground"

export function AboutHero() {
    return (
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-background">
            {/* Particle Background */}
            <ParticleBackground />

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
                        ABOUT TECHNOHACK
                    </h1>

                    <p className="text-xl md:text-2xl font-bold text-cyan-400 tracking-wide">
                        Innovate. Decode. Compete.
                    </p>

                    <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        A two-day inter-departmental technical and management fest designed to challenge students across technology, creativity, business, and innovation domains.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
