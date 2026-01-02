"use client"

import { motion } from "framer-motion"
import { homePageData } from "@/lib/config/homePageData"

export function SponsorsStrip() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-3">
                        Organized By
                    </h3>
                    <div className="text-xl text-cyan-400 font-semibold mb-2">
                        {homePageData.organizers.college}
                    </div>
                    <div className="text-gray-400 mb-8">
                        {homePageData.organizers.location}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {homePageData.organizers.departments.map((dept, index) => (
                            <motion.div
                                key={dept}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 text-white font-medium"
                            >
                                {dept}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
