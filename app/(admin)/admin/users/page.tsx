import type { ReactNode } from "react";
import { getAdminUserDirectory, type AdminUserRecord } from "@/lib/actions/admin.actions";
import { BadgeCheck, Shield, UserMinus, Users2 } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-IN");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
});

export default async function AdminUsersPage() {
    const { stats, users } = await getAdminUserDirectory();

    const cards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            description: "Accounts synced from Clerk",
            icon: <Users2 className="w-5 h-5" />,
            accent: "from-cyan-500/60 to-blue-500/10"
        },
        {
            label: "Admin & Super",
            value: stats.adminUsers,
            description: "Can access control center",
            icon: <Shield className="w-5 h-5" />,
            accent: "from-purple-500/60 to-indigo-500/10"
        },
        {
            label: "Active",
            value: stats.activeUsers,
            description: "Enabled + not banned",
            icon: <BadgeCheck className="w-5 h-5" />,
            accent: "from-emerald-500/60 to-teal-500/10"
        },
        {
            label: "Banned",
            value: stats.bannedUsers,
            description: "Locked for compliance",
            icon: <UserMinus className="w-5 h-5" />,
            accent: "from-rose-500/60 to-orange-500/10"
        }
    ];

    return (
        <div className="space-y-10">
            <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Directory</p>
                <h1 className="text-4xl font-bold font-orbitron text-white">Participant Accounts</h1>
                <p className="text-sm text-gray-400 max-w-3xl">
                    Audit who has access, monitor engagement, and keep roles in check. All data streams directly from Clerk and MongoDB in real time.
                </p>
            </header>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </section>

            <UsersTable users={users} />
        </div>
    );
}

function StatCard({ label, value, description, icon, accent }: { label: string; value: number; description: string; icon: ReactNode; accent: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07070f] p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{label}</p>
                    <p className="text-4xl font-black text-white mt-3">{numberFormatter.format(value)}</p>
                    <p className="text-xs text-white/70 mt-2">{description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center text-white">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function UsersTable({ users }: { users: AdminUserRecord[] }) {
    return (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">Contact</th>
                            <th className="px-6 py-4 text-left">Role</th>
                            <th className="px-6 py-4 text-left">Activity</th>
                            <th className="px-6 py-4 text-right">Registrations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold">{user.name}</span>
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    <p>{user.email}</p>
                                    <p className="text-xs text-gray-500">{user.phone || "No phone"}</p>
                                    <p className="text-xs text-gray-500">{user.college || "No college"}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2">
                                        <RoleBadge role={user.role} />
                                        <StatusBadge isActive={user.isActive} isBanned={user.isBanned} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    <p>Last login: <span className="text-white">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</span></p>
                                </td>
                                <td className="px-6 py-4 text-right text-white font-semibold">
                                    {user.registrationCount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: AdminUserRecord["role"] }) {
    const palette: Record<AdminUserRecord["role"], string> = {
        user: "bg-white/10 text-white",
        admin: "bg-cyan-500/20 text-cyan-300",
        superadmin: "bg-purple-500/20 text-purple-200"
    };

    return (
        <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${palette[role]}`}>
            {role}
        </span>
    );
}

function StatusBadge({ isActive, isBanned }: { isActive: boolean; isBanned: boolean }) {
    if (isBanned) {
        return (
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Banned
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-gray-500"}`} />
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

function formatDate(input?: string) {
    if (!input) return "—";
    return dateFormatter.format(new Date(input));
}
