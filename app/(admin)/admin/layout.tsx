import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, Calendar, Users, LogOut, FileText } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // NOTE: Add Admin Role Check here in production

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-card hidden md:flex flex-col">
                <div className="p-6">
                    <span className="text-xl font-bold font-orbitron text-primary tracking-wider">
                        ADMIN
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink href="/admin/events" icon={<Calendar size={20} />} label="Events" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        System Online
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    )
}
