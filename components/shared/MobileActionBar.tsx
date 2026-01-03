"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export type MobileAction = {
    label: string
    href: string
    variant?: "primary" | "secondary"
}

interface MobileActionBarProps {
    title?: string
    subtitle?: string
    actions?: MobileAction[]
    children?: ReactNode
    className?: string
    dismissible?: boolean
}

export function MobileActionBar({ title, subtitle, actions = [], children, className, dismissible = true }: MobileActionBarProps) {
    const [dismissed, setDismissed] = useState(false)

    if (dismissed || (!title && !subtitle && actions.length === 0 && !children)) return null

    return (
        <div className={cn("lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-4", className)}>
            <div className="relative rounded-3xl border border-white/10 bg-black/90 backdrop-blur-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] space-y-4">
                {dismissible && (
                    <button
                        type="button"
                        aria-label="Dismiss helper"
                        onClick={() => setDismissed(true)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition"
                    >
                        ×
                    </button>
                )}
                {(title || subtitle) && (
                    <div>
                        {title && <p className="text-sm font-semibold text-white">{title}</p>}
                        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                    </div>
                )}

                {children}

                {actions.length > 0 && (
                    <div className={cn("flex gap-3", actions.length > 1 ? "flex-col sm:flex-row" : "") }>
                        {actions.map(action => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={cn(
                                    "flex-1 text-center rounded-2xl py-3 font-semibold",
                                    action.variant === "secondary"
                                        ? "bg-white/5 border border-white/10 text-white"
                                        : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_10px_30px_rgba(79,209,197,0.35)]"
                                )}
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
