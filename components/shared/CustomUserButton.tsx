"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { User, LogOut, Settings, LayoutDashboard, ChevronDown, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export function CustomUserButton() {
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        await signOut()
        router.push("/")
    }

    if (!user) return null

    const userInitials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.emailAddresses[0]?.emailAddress[0].toUpperCase()

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                    {user.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt={user.fullName || "User"}
                            width={32}
                            height={32}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        userInitials
                    )}
                </div>

                {/* User Name (Desktop only) */}
                <span className="hidden md:block text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    {user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0]}
                </span>

                {/* Chevron */}
                <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right">
                    {/* Backdrop blur container */}
                    <div className="relative">
                        {/* Decorative glow */}
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-lg blur-sm opacity-75"></div>

                        {/* Menu container */}
                        <div className="relative bg-[#0a0a0f]/95 backdrop-blur-xl rounded-lg border border-cyan-500/20 shadow-2xl overflow-hidden">
                            {/* User Info Section */}
                            <div className="px-4 py-3 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {user.imageUrl ? (
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.fullName || "User"}
                                                width={40}
                                                height={40}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            userInitials
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">
                                            {user.fullName || "User"}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {user.emailAddresses[0]?.emailAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                                >
                                    <Shield className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                                    <span>Admin Panel</span>
                                </Link>

                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-200 group"
                                >
                                    <Settings className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                                    <span>Settings</span>
                                </Link>

                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-pink-500/10 transition-all duration-200 group"
                                >
                                    <User className="w-4 h-4 text-pink-400 group-hover:text-pink-300" />
                                    <span>Profile</span>
                                </Link>
                            </div>

                            {/* Sign Out */}
                            <div className="border-t border-cyan-500/10 py-2">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
