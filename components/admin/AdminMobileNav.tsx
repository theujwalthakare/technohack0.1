"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type AdminMobileNavLink = {
    href: string
    label: string
}

interface AdminMobileNavProps {
    links: AdminMobileNavLink[]
}

export function AdminMobileNav({ links }: AdminMobileNavProps) {
    const pathname = usePathname()

    if (!links.length) return null

    return (
        <div className="lg:hidden border-t border-cyan-500/10 bg-[#030307]/90 backdrop-blur-xl px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {links.map(link => {
                    const isActive = pathname?.startsWith(link.href)
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-colors",
                                isActive
                                    ? "border-cyan-400/70 text-white bg-cyan-500/10 shadow-[0_5px_20px_rgba(6,182,212,0.2)]"
                                    : "border-white/10 text-white/70 hover:text-white hover:border-white/30"
                            )}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
