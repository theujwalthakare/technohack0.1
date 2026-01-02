"use client"

import { motion } from "framer-motion"
import { Clock, MapPin, Circle } from "lucide-react"

interface TimelineEvent {
    time: string
    event: string
    venue: string
    type: "general" | "competition" | "break"
    category?: string
}

interface DayTimelineProps {
    dayNumber: number
    date: string
    dayName: string
    events: TimelineEvent[]
}

export function DayTimeline({ dayNumber, date, dayName, events }: DayTimelineProps) {
    const getEventColor = (type: string) => {
        switch (type) {
            case "competition":
                return "from-cyan-500/20 to-purple-500/20 border-cyan-500/40"
            case "break":
                return "from-orange-500/20 to-yellow-500/20 border-orange-500/40"
            default:
                return "from-gray-500/20 to-gray-600/20 border-gray-500/40"
        }
    }

    const getIconColor = (type: string) => {
        switch (type) {
            case "competition":
                return "text-cyan-400"
            case "break":
                return "text-orange-400"
            default:
                return "text-gray-400"
        }
    }

    return (
        <div className="mb-12">
            {/* Day Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
            >
                <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30">
                    <h2 className="text-2xl md:text-3xl font-black font-orbitron text-white">
                        Day {dayNumber} - <span className="text-cyan-400">{dayName}</span>
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">{date}</p>
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50" />

                {/* Events */}
                <div className="space-y-6">
                    {events.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative flex gap-4 md:gap-6"
                        >
                            {/* Timeline Dot */}
                            <div className={`flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${getEventColor(item.type)} border-2 flex items-center justify-center z-10`}>
                                <Circle className={`w-4 h-4 md:w-5 md:h-5 ${getIconColor(item.type)} fill-current`} />
                            </div>

                            {/* Event Card */}
                            <div className="flex-1 pb-2">
                                <div className={`p-4 md:p-5 rounded-lg bg-gradient-to-br ${getEventColor(item.type)} border backdrop-blur-sm hover:scale-[1.02] transition-transform`}>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                        <h3 className="text-lg md:text-xl font-bold text-white">
                                            {item.event}
                                        </h3>
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                                            <Clock className="w-4 h-4" />
                                            {item.time}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-purple-400" />
                                            <span>{item.venue}</span>
                                        </div>
                                        {item.category && (
                                            <>
                                                <span className="hidden sm:inline text-gray-500">•</span>
                                                <span className="text-purple-400 font-semibold">{item.category}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
