"use client"

import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { Rocket } from "lucide-react"

const CLIP_PATH = "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)"

export function FinalCTA() {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useMotionTemplate`${mouseYSpring}deg`
    const rotateY = useMotionTemplate`${mouseXSpring}deg`

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct * 10)
        y.set(yPct * -10)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    return (
        <section className="py-20 px-4 relative overflow-hidden flex items-center justify-center min-h-[20vh]">
            {/* Background */}
            <div className="absolute inset-0 bg-[#020205] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(to_top,#000_0%,transparent_100%)] z-10" />
            </div>

            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative z-20 w-full max-w-3xl mx-auto perspective-1000"
            >
                {/* 3D Container */}
                <div
                    className="relative group transition-transform duration-500 ease-out"
                    style={{
                        filter: isHovered ? "drop-shadow(0 0 30px rgba(6,182,212,0.3))" : "drop-shadow(0 0 10px rgba(0,0,0,0.5))"
                    }}
                >
                    {/* The Outer Shape (Gradient Border) */}
                    {/* We use a relative container with padding to simulate the border width */}
                    <div
                        className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-xy p-[2px]"
                        style={{ clipPath: CLIP_PATH }}
                    >
                        {/* The Inner Content (Black Background) */}
                        <div
                            className="bg-[#0A0A12] relative flex flex-col items-center text-center p-8 md:p-12 overflow-hidden"
                            style={{ clipPath: CLIP_PATH }}
                        >
                            {/* Grid/Effects Background Layers */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]" />
                            </div>

                            {/* Top/Bottom Lines */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                            {/* Content Layer */}
                            <div className="relative z-20 transform translate-z-[50px]">
                                {/* Rocket Icon */}
                                <div className="relative inline-block mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
                                    <div className="relative w-20 h-20 rounded-full border-2 border-cyan-500/50 flex items-center justify-center bg-cyan-950/30 backdrop-blur-md">
                                        <Rocket className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <div className="absolute inset-[-8px] border border-cyan-500/30 rounded-full border-t-transparent animate-spin-slow" />
                                </div>

                                <motion.h2
                                    className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter text-white mb-4 uppercase"
                                    style={{ textShadow: "0 0 20px rgba(6,182,212,0.5)" }}
                                >
                                    Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Launch?</span>
                                </motion.h2>

                                <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                                    Join the elite league of <span className="text-cyan-400 font-bold">5000+</span> innovators.
                                    <br />The future is waiting for your code.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link
                                        href="/events"
                                        className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg tracking-wider transition-all duration-300 clip-path-button overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            REGISTER NOW
                                            <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-300 ease-in-out" />
                                    </Link>

                                    <Link
                                        href="/about"
                                        className="group px-8 py-4 bg-transparent border border-white/20 hover:border-cyan-400/50 hover:bg-cyan-950/30 text-white font-bold text-lg tracking-wider transition-all duration-300 clip-path-button"
                                    >
                                        LEARN MORE
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
