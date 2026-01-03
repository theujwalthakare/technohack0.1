"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser, useClerk } from "@clerk/nextjs"
import { CustomUserButton } from "@/components/shared/CustomUserButton"

type RegistrationEntry = {
    _id: string
    status: string
    eventId?: {
        title: string
        dateTime: string
        venue: string
    } | null
}

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
    const [isAdmin, setIsAdmin] = useState(false)
    const [recentRegistrations, setRecentRegistrations] = useState<RegistrationEntry[]>([])
    const pathname = usePathname()
    const router = useRouter()
    const { isSignedIn } = useUser()
    const { signOut } = useClerk()

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

    useEffect(() => {
        let isMounted = true

        if (!isSignedIn) {
            queueMicrotask(() => {
                if (isMounted) setIsAdmin(false)
                if (isMounted) setRecentRegistrations([])
            })
            return () => {
                isMounted = false
            }
        }

        const controller = new AbortController()

        fetch("/api/me/profile", { signal: controller.signal })
            .then((response) => response.ok ? response.json() : null)
            .then((data) => {
                if (!isMounted) return
                setIsAdmin(Boolean(data?.isAdmin))
            })
            .catch(() => {
                if (!isMounted) return
                setIsAdmin(false)
            })

        fetch("/api/me/registrations")
            .then((response) => response.ok ? response.json() : null)
            .then((data) => {
                if (!isMounted) return
                const regs: RegistrationEntry[] = data?.registrations ?? []
                setRecentRegistrations(regs.slice(0, 3))
            })
            .catch(() => {
                if (!isMounted) return
                setRecentRegistrations([])
            })

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [isSignedIn])

    const showAdminLink = isSignedIn && isAdmin
    const showDashboardLink = isSignedIn && !isAdmin

    const userNavLinks = isSignedIn && !isAdmin
        ? [...navLinks, { href: "/registrations", label: "My Events" }]
        : navLinks

    const handleSignOut = async () => {
        setIsOpen(false)
        try {
            await signOut({ redirectUrl: "/" })
        } catch (error) {
            console.error(error)
            router.push("/")
        }
    }
    const visibleLinks = showAdminLink
        ? [...userNavLinks, { href: "/admin", label: "Admin" }]
        : userNavLinks

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
                {/* Responsive grid that collapses to a simple flex row on mobile */}
                <div className="flex items-center justify-between h-16 gap-4 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">

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
                            {visibleLinks.map((link) => {
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

                    {/* Mobile Utility Cluster */}
                    <div className="flex items-center gap-2 md:hidden">
                        {showAdminLink && (
                            <Link
                                href="/admin"
                                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-cyan-400/40 text-cyan-100"
                            >
                                Admin
                            </Link>
                        )}
                        {isSignedIn ? (
                            showDashboardLink && (
                                <Link
                                    href="/dashboard"
                                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20 text-white/80 hover:text-white"
                                >
                                    Dashboard
                                </Link>
                            )
                        ) : (
                            <Link
                                href="/sign-in"
                                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-black"
                            >
                                Login
                            </Link>
                        )}
                        {isSignedIn && (
                            <button
                                onClick={handleSignOut}
                                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-red-400/40 text-red-200 hover:text-white hover:border-red-400/70 transition-colors"
                            >
                                Logout
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 grid place-items-center text-white/70 hover:text-white transition-colors rounded-xl border border-white/10"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Panel */}
            <div className={cn(
                "md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-white/[0.08]",
                isOpen ? "max-h-96" : "max-h-0"
            )}>
                <div className="relative px-4 pt-4 pb-6 space-y-1 bg-black/60 backdrop-blur-xl">
                    {/* Mobile Nav Links */}
                    {visibleLinks.map((link) => {
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
                    <div className="pt-3 mt-3 border-t border-white/[0.08] space-y-2">
                        {isSignedIn ? (
                            <>
                                {showDashboardLink && (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-300 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </>
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

                    {isSignedIn && (
                        <div className="mt-4 border-t border-white/[0.08] pt-3 space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">My registrations</p>
                            {recentRegistrations.length === 0 ? (
                                <p className="text-xs text-white/50">No events yet. Tap "Events" to explore.</p>
                            ) : (
                                recentRegistrations.map((registration) => {
                                    const event = registration.eventId
                                    if (!event) return null
                                    const dateLabel = event.dateTime ? new Date(event.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Soon"
                                    return (
                                        <div key={registration._id} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80 bg-white/5">
                                            <p className="font-semibold text-white">{event.title}</p>
                                            <p className="text-xs text-white/60">{dateLabel} · {event.venue}</p>
                                            <span className="mt-2 inline-flex text-[11px] uppercase tracking-[0.3em] text-white/70">{registration.status}</span>
                                        </div>
                                    )
                                })
                            )}
                            <Link
                                href="/registrations"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300"
                            >
                                Open my events →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
