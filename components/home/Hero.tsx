"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { ParticleBackground } from "@/components/effects/ParticleBackground"

export function Hero() {
    return (
        <section className="relative min-h-[90vh] px-4 sm:px-8 pt-32 pb-16 select-none flex items-center justify-center overflow-hidden bg-background">

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

            {/* Scan Line Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                    style={{
                        animation: "scanLine 4s linear infinite"
                    }}
                />
            </div>

            {/* Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,600px)] h-[min(90vw,600px)] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full" />

            <div className="relative z-10 text-center px-0 max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-bold mb-6 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2"></span>
                    </span>
                    REGISTRATION OPEN FOR 2026
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mb-10 flex flex-col items-center justify-center"
                >
                    <div className="relative group">
                        {/* 3D Depth Layer */}
                        <h1
                            className="text-[clamp(2.6rem,12vw,5.4rem)] md:text-[clamp(5.5rem,8vw,9rem)] font-black font-orbitron tracking-tight text-cyan-900 absolute top-1.5 left-1.5 inset-0 select-none blur-[1px]"
                            aria-hidden="true"
                        >
                            TECHNOHACK
                        </h1>

                        {/* Main Holographic Title */}
                        <h1 className="relative text-[clamp(2.6rem,12vw,5.4rem)] md:text-[clamp(5.5rem,8vw,9rem)] leading-[0.95] font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500 z-10"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to bottom, #ffffffff 0%, #a5f3fc 50%, #06b6d4 100%),
                                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0'/%3E%3C/svg%3E")
                                `,
                                backgroundBlendMode: 'overlay',
                                backgroundSize: '100% 100%, 200px 200px',
                                textShadow: '0 0 30px rgba(12, 219, 251, 0.5), 0 0 60px rgba(168,85,247,0.3)'
                            }}
                        >
                            TECHNOHACK
                        </h1>


                        {/* Interactive Shine/Sparkle Overlay (Clipped to Text) */}
                        <h1
                            className="absolute inset-0 z-20 text-[clamp(2.6rem,12vw,5.4rem)] md:text-[clamp(5.5rem,8vw,9rem)] font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none select-none"
                            aria-hidden="true"
                            style={{
                                backgroundSize: '200% auto',
                                animation: 'shine 3s linear infinite',
                                animationPlayState: 'paused'
                            }}
                        >
                            <span className="group-hover:[animation-play-state:running]">TECHNOHACK</span>
                        </h1>

                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 flex items-center justify-center gap-3"
                    >
                        <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-cyan-500" />
                        <span className="text-2xl sm:text-3xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] glitch-text">
                            2026
                        </span>
                        <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-purple-500" />
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-xl md:text-3xl text-cyan-100/80 max-w-3xl mx-auto mb-10 font-medium text-balance"
                >
                    From Ideas to Impact. Join <span className="text-cyan-400 font-bold">200+</span> developers, creators, and Students for <span className="text-purple-400 font-bold">2 days</span> of creation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row w-full items-stretch sm:items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base md:text-lg font-medium text-gray-300 mb-10"
                >
                    <div className="flex items-center justify-center gap-3 bg-purple-950/30 px-4 py-2 rounded-lg border border-purple-500/20 backdrop-blur-sm">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span className="text-sm sm:text-base">Jan 08 - 09, 2026</span>
                    </div>
                    <div className="hidden sm:block text-cyan-500/50">•</div>
                    <div className="flex items-center justify-center gap-3 bg-pink-950/30 px-4 py-2 rounded-lg border border-pink-500/20 backdrop-blur-sm">
                        <MapPin className="w-5 h-5 text-pink-400" />
                        <span className="text-sm sm:text-base">K.V.N. Naik College, Nashik</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/events"
                        className="group relative px-6 py-3 rounded-lg bg-cyan-500 text-black font-bold text-base sm:text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto"
                    >
                        <span className="relative z-10">Explore Events</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        {/* Scanline effect */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-500" />
                    </Link>
                    <Link
                        href="/about"
                        className="px-6 py-3 rounded-lg bg-white/5 border border-cyan-500/30 text-white font-bold text-base sm:text-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-sm w-full sm:w-auto"
                    >
                        Learn More
                    </Link>
                </motion.div>

            </div>

        </section>
    )
}
