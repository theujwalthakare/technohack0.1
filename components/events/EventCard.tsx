"use client"

import React, { useRef } from "react"
import Link from "next/link"
import Image from "next/image"

// --- 6️⃣ Design Token Extraction ---
const TOKENS = {
    CLIP_PATH: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
}

interface EventCardProps {
    event: {
        _id: string
        title: string
        slug: string
        description: string
        image: string
        category: string
        dateTime: string | Date
        venue: string
        price: number
        teamSize: number
        firstPrize: number
        secondPrize: number
    }
}

export function EventCard({ event }: EventCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    // --- 2️⃣ INTELLIGENT HOVER PARALLAX (Cursor-Aware) ---
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const rotateX = ((y / rect.height) - 0.5) * -6
        const rotateY = ((x / rect.width) - 0.5) * 6

        cardRef.current.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const resetTilt = () => {
        if (cardRef.current)
            cardRef.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"
    }

    // --- 3️⃣ EVENT STATUS BADGES ---
    const getEventStatus = () => {
        const now = new Date();
        const eventDate = new Date(event.dateTime);
        const timeDiff = eventDate.getTime() - now.getTime();

        if (eventDate < now) return "CLOSED";
        if (timeDiff < 86400000) return "LIVE"; // Less than 24h
        return "UPCOMING";
    }
    const status = getEventStatus();

    // Prize display with fallback
    const firstPrize = event.firstPrize || 2000;
    const secondPrize = event.secondPrize || 1000;
    const totalPrize = firstPrize + secondPrize;
    const prizeDisplay = `₹${totalPrize.toLocaleString('en-IN')}`;

    // Debug log (remove after testing)
    if (typeof window !== 'undefined') {
        console.log('Event:', event.title, 'First:', event.firstPrize, 'Second:', event.secondPrize, 'Display:', prizeDisplay);
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="relative w-full max-w-[280px] mx-auto group transition-transform duration-200 ease-out"
            role="article" // 5️⃣ Accessibility
            aria-labelledby={`event-${event._id}`}
        >
            {/* 1️⃣ TRUE NEON EDGE GLOW (Dynamic) */}
            <div className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:scale-105">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "conic-gradient(from 0deg, transparent 0%, rgba(5, 194, 227, 0.8), transparent 20%, transparent 80%, rgba(169, 83, 251, 0.8), transparent 100%)",
                        clipPath: TOKENS.CLIP_PATH
                    }}
                />
            </div>

            {/* Main Content Container (Acts as the Gradient Border) */}
            <div
                className="relative h-[400px] w-full transition-transform duration-500 group-hover:scale-95 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500"
                style={{ clipPath: TOKENS.CLIP_PATH }}
            >
                {/* Inner Content Background (The Card Body) */}
                <div
                    className="absolute inset-[1.5px] bg-[#050511] z-10 flex flex-col"
                    style={{ clipPath: TOKENS.CLIP_PATH }}
                >
                    {/* Header */}
                    <div className="h-12 border-b border-white/2 flex items-center justify-center relative bg-black/20">
                        <div className="absolute left-0 top-18 bottom-0 w-[10px] border-r border-white/2 flex items-center justify-center bg-black/40">
                            <span className="text-[8px] font-bold text-gray-600 -rotate-90 tracking-widest whitespace-nowrap group-hover:text-cyan-400 transition-colors duration-300">COMPETITIONS</span>
                        </div>
                        <h3
                            id={`event-${event._id}`}
                            className="pl-6 pr-4 text-center text-white font-orbitron font-bold tracking-wider text-sm truncate uppercase w-full group-hover:text-cyan-400 transition-colors duration-300"
                        >
                            {event.title}
                        </h3>
                    </div>

                    {/* Media Section */}
                    <div className="relative flex-1 bg-black/50 ml-8 border-b border-white/5 overflow-hidden group-hover:border-cyan-500/30 transition-colors duration-500">
                        {/* 3️⃣ Event Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                            <span
                                className={`text-[9px] px-2 py-1 font-bold tracking-widest border uppercase backdrop-blur-md
                                ${status === "LIVE" && "text-green-400 border-green-400/50 bg-green-950/40"}
                                ${status === "UPCOMING" && "text-cyan-400 border-cyan-400/50 bg-cyan-950/40"}
                                ${status === "CLOSED" && "text-red-400 border-red-400/50 bg-red-950/40"}
                                `}
                            >
                                {status}
                            </span>
                        </div>

                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            priority={false}
                            className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                            sizes="(max-width: 768px) 100vw, 320px"
                        />

                        {/* 4️⃣ Glass Depth Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-transparent to-transparent opacity-80 group-hover:opacity-0 transition-opacity" />

                        {/* Description Reveal (Glassmorphism) */}
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6"
                            style={{
                                backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0), linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
                                backgroundSize: "4px 4px, 100% 100%",
                                backdropFilter: "blur(12px)"
                            }}
                        >
                            <p className="text-cyan-50 text-xs font-medium text-center leading-relaxed line-clamp-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="h-24 bg-[#0b0f14] ml-8 flex flex-col relative z-20">
                        <div className="flex-1 flex items-center gap-2 p-2">
                            <Link
                                href={`/events/${event.slug}`}
                                className="flex-1 bg-cyan-950/20 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black text-cyan-400 text-[10px] font-bold py-2 px-1 flex items-center justify-center uppercase transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] relative overflow-hidden group/btn"
                                aria-label={`Register for ${event.title}`}
                            >
                                <span className="relative z-10">REGISTER</span>
                                {/* Button Scanline Effect */}
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-[-100%] transition-transform duration-500" />
                            </Link>

                            <Link
                                href={`/events/${event.slug}`}
                                className="flex-1 border border-white/5 hover:border-purple-500 text-gray-400 hover:text-purple-300 text-[10px] font-bold py-2 px-1 flex items-center justify-center uppercase transition-all"
                                aria-label={`Explore ${event.title}`}
                            >
                                EXPLORE
                            </Link>
                        </div>

                        {/* Prize Pool */}
                        <div className="h-8 relative bg-gradient-to-r from-cyan-950/20 to-purple-900/20 flex items-center justify-center border-t border-white/5 group-hover:border-cyan-500/20 transition-colors">
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-l border-t border-white/10 group-hover:border-cyan-500/50 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-r border-t border-white/10 group-hover:border-cyan-500/50 transition-colors"></div>

                            <div className="text-center">
                                <p className="text-[7px] text-gray-500 uppercase tracking-widest mb-0.5">Prize Pool</p>
                                <p className="text-[9px] text-gray-200 font-bold tracking-wider group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.5)] transition-all">
                                    {prizeDisplay}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
