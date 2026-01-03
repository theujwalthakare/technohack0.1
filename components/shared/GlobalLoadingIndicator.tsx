"use client"

import { useEffect, useState } from "react"
import Router from "next/router"
import { cn } from "@/lib/utils"
import { beginGlobalLoading, endGlobalLoading, subscribeToGlobalLoading } from "@/lib/utils/global-loading"

export function GlobalLoadingIndicator() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const unsubscribe = subscribeToGlobalLoading((state) => {
            setIsVisible(state)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const handleStart = () => beginGlobalLoading()
        const handleEnd = () => endGlobalLoading()

        Router.events.on("routeChangeStart", handleStart)
        Router.events.on("routeChangeComplete", handleEnd)
        Router.events.on("routeChangeError", handleEnd)

        return () => {
            Router.events.off("routeChangeStart", handleStart)
            Router.events.off("routeChangeComplete", handleEnd)
            Router.events.off("routeChangeError", handleEnd)
        }
    }, [])

    return (
        <div
            className={cn(
                "pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0"
            )}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col items-center gap-4 text-white">
                <div className="w-14 h-14 rounded-full border-2 border-white/10 border-t-cyan-400 border-l-cyan-400 animate-spin shadow-[0_0_20px_rgba(34,211,238,0.25)]" />
                <div className="flex flex-col items-center text-xs uppercase tracking-[0.4em] text-white/70">
                    <span>Rendering</span>
                    <span className="text-[10px] tracking-[0.6em] text-cyan-200/80">Please wait</span>
                </div>
            </div>
        </div>
    )
}
