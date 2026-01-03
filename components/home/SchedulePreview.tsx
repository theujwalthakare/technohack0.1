"use client"

import { motion } from "framer-motion"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { homePageData } from "@/lib/config/homePageData"
import { MapPin } from "lucide-react"

export function SchedulePreview() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <SectionHeader
                    title="Event Schedule"
                    subtitle="Plan your TechnoHack journey"
                />

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Day 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm"
                    >
                        <h3 className="text-2xl font-bold font-orbitron text-cyan-400 mb-4">
                            Day 1 - {homePageData.schedule.day1.date}
                        </h3>
                        <div className="space-y-4">
                            {homePageData.schedule.day1.highlights.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-20 text-cyan-400 font-bold text-sm">
                                        {item.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white">{item.event}</div>
                                        <div className="text-sm text-gray-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {item.venue}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Day 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm"
                    >
                        <h3 className="text-2xl font-bold font-orbitron text-purple-400 mb-4">
                            Day 2 - {homePageData.schedule.day2.date}
                        </h3>
                        <div className="space-y-4">
                            {homePageData.schedule.day2.highlights.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-20 text-purple-400 font-bold text-sm">
                                        {item.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white">{item.event}</div>
                                        <div className="text-sm text-gray-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {item.venue}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
