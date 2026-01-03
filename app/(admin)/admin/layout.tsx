import { ensureAdminRole } from "@/lib/utils/admin"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Settings,
    Shield,
    BarChart3,
    UserCog,
    IndianRupee
} from "lucide-react"
import React from "react"
import { AdminActionToast } from "@/components/admin/AdminActionToast"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Ensure user is admin (auto-assign if whitelisted)
    const result = await ensureAdminRole()

    if (!result.success) {
        // Redirect to unauthorized page
        redirect("/unauthorized")
    }

    const user = result.user

    const mobileNavLinks = [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/analytics", label: "Analytics" },
        { href: "/admin/events", label: "Events" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/registrations", label: "Registrations" },
        { href: "/admin/payment-settings", label: "Payments" },
        ...(user?.role === "superadmin" ? [
            { href: "/admin/audit-logs", label: "Audit Logs" },
            { href: "/admin/admins", label: "Admin Users" },
            { href: "/admin/settings", label: "Settings" }
        ] : [])
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-72 border-r border-cyan-500/20 bg-gradient-to-b from-[#0a0a0f] to-[#050508] hidden lg:flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                ADMIN
                            </h1>
                            <p className="text-xs text-gray-500">Control Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <NavSection title="Overview">
                        <NavLink
                            href="/admin"
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                        />
                        <NavLink
                            href="/admin/analytics"
                            icon={<BarChart3 size={20} />}
                            label="Analytics"
                        />
                    </NavSection>

                    <NavSection title="Management">
                        <NavLink
                            href="/admin/events"
                            icon={<Calendar size={20} />}
                            label="Events"
                        />
                        <NavLink
                            href="/admin/users"
                            icon={<Users size={20} />}
                            label="Users"
                        />
                        <NavLink
                            href="/admin/registrations"
                            icon={<FileText size={20} />}
                            label="Registrations"
                        />
                        <NavLink
                            href="/admin/payment-settings"
                            icon={<IndianRupee size={20} />}
                            label="Payment Settings"
                        />
                    </NavSection>

                    {user?.role === 'superadmin' && (
                        <NavSection title="System">
                            <NavLink
                                href="/admin/audit-logs"
                                icon={<Shield size={20} />}
                                label="Audit Logs"
                            />
                            <NavLink
                                href="/admin/admins"
                                icon={<UserCog size={20} />}
                                label="Admin Users"
                            />
                            <NavLink
                                href="/admin/settings"
                                icon={<Settings size={20} />}
                                label="Settings"
                            />
                        </NavSection>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            System Online
                        </div>
                        <span className="text-xs text-gray-600">
                            {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </span>
                    </div>
                    <Link
                        href="/"
                        className="block text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="border-b border-cyan-500/20 bg-[#0a0a0f]/60 backdrop-blur-xl px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80 font-semibold mb-1">Operations</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white">Admin Panel</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Managing TechnoHack 2026 · Signed in as <span className="text-cyan-300 font-medium">{user?.firstName || "Admin"}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-xs text-cyan-200 lg:hidden">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </span>
                        <Link
                            href="/"
                            className="text-sm font-semibold text-cyan-400 hover:text-cyan-200 transition lg:hidden"
                        >
                            ← Back to Site
                        </Link>
                    </div>
                    {/* <CustomUserButton /> */}
                </header>

                <AdminMobileNav links={mobileNavLinks} />

                <AdminActionToast />

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 pb-12 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {title}
            </h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 group"
        >
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {icon}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    )
}
