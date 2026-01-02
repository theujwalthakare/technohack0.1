"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
    title: string
    subtitle?: string
    align?: "left" | "center"
}

export function SectionHeader({ title, subtitle, align = "center" }: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}
        >
            <h2 className="text-4xl md:text-5xl font-black font-orbitron tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
            {/* Cyber accent line */}
            <div className={`mt-4 h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 ${align === "center" ? "mx-auto" : ""}`} />
        </motion.div>
    )
}
