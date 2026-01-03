"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { CustomUserButton } from "@/components/shared/CustomUserButton"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const pathname = usePathname()
    const { isSignedIn } = useUser()

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show navbar when at top, hide when scrolling down, show when scrolling up
            if (currentScrollY < 10) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down - hide navbar
                setIsVisible(false)
            } else {
                // Scrolling up - show navbar
                setIsVisible(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 ease-out select-none bg-background",
            isVisible ? "translate-y-0" : "-translate-y-full"
        )}>
            {/* Particle Background - Same as Hero */}
            {/* <div className="absolute inset-0 overflow-hidden">
                <ParticleBackground />
            </div> */}

            {/* Animated Grid Overlay - Same as Hero */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]"
                    style={{
                        animation: "gridPulse 8s ease-in-out infinite"
                    }}
                />
            </div>

            {/* Gradient Glow - Subtle version */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Bottom border divider */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 3-Zone Grid Architecture */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8 h-16">

                    {/* ZONE 1: Brand (Left) */}
                    <Link href="/" className="flex-shrink-0 group">
                        <div className="relative transition-transform duration-200 group-hover:scale-[1.02]">
                            <Image
                                src="/images/logo1.png"
                                alt="TechnoHack"
                                width={140}
                                height={32}
                                className="h-8 w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* ZONE 2: Primary Navigation (Center) */}
                    <nav className="hidden md:flex items-center justify-center">
                        <ul className="flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full",
                                                isActive
                                                    ? "bg-white/[0.12] text-white"
                                                    : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* ZONE 3: Utility Cluster + Auth (Right) */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Social Icons */}



                        {/* Divider */}
                        <div className="w-px h-5 bg-white/10 mx-1" />

                        {/* Auth Section */}
                        {isSignedIn ? (
                            <CustomUserButton />
                        ) : (
                            <Link
                                href="/sign-in"
                                className="group relative px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/20"
                            >
                                <span className="flex items-center gap-1.5">
                                    <User size={16} />
                                    Login
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-9 h-9 grid place-items-center text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/[0.06]"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Panel */}
            <div className={cn(
                "md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-white/[0.08]",
                isOpen ? "max-h-96" : "max-h-0"
            )}>
                <div className="relative px-4 pt-4 pb-6 space-y-1 bg-black/60 backdrop-blur-xl">
                    {/* Mobile Nav Links */}
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-white/[0.12] text-white"
                                        : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                                )}
                            >
                                {link.label}
                            </Link>
                        )
                    })}

                    {/* Mobile Auth */}
                    <div className="pt-3 mt-3 border-t border-white/[0.08]">
                        {isSignedIn ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/sign-in"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-center bg-white text-black text-sm font-medium rounded-lg hover:scale-[1.01] transition-transform duration-200"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <User size={16} />
                                    Login
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
