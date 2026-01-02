"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/technohack2026", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "https://linkedin.com/company/technohack", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Mail, href: "mailto:support@technohack.org", label: "Email", color: "hover:text-cyan-400" }
]

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/schedule", label: "Schedule" },
    { href: "/about", label: "About" }
]

export function Footer() {
    return (
        <footer className="relative bg-background border-t border-cyan-500/20 mt-auto overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF12_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF12_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[100px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            <Link href="/" className="block">
                                <div className="relative w-[180px] h-14 mb-3">
                                    <Image
                                        src="/images/logo1.png"
                                        alt="TechnoHack 2026"
                                        fill
                                        className="object-contain brightness-110"
                                        style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))' }}
                                    />
                                </div>
                            </Link>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            From Ideas to Impact. The ultimate tech fest bringing together innovation, creativity, and competition.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-500/20 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]`}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold font-orbitron text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-[2px] bg-cyan-400 group-hover:w-3 transition-all duration-300"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold font-orbitron text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2 text-gray-400">
                                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <span>K.V.N. Naik College<br />Canada Corner, Nashik</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                <a href="mailto:support@technohack.org" className="hover:text-cyan-400 transition-colors">
                                    support@technohack.org
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Event Info */}
                    <div>
                        <h3 className="text-white font-bold font-orbitron text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                            Event Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/20">
                                <p className="text-cyan-400 font-bold mb-1">January 08-09, 2026</p>
                                <p className="text-gray-400 text-xs">Two days of innovation</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-950/20 to-pink-950/20 border border-purple-500/20">
                                <p className="text-purple-400 font-bold mb-1">10 Events</p>
                                <p className="text-gray-400 text-xs">₹30K Prize Pool</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-cyan-500/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-xs">
                            © 2026 TechnoHack. Organized by <span className="text-cyan-400 font-bold">Coderminds</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                            <span className="text-gray-700">•</span>
                            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-cyan-500/20"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-purple-500/20"></div>
        </footer>
    )
}
