import { ReactNode } from "react";
import { getAdminStats } from "@/lib/actions/admin.actions";
import { Users, Calendar, Activity } from "lucide-react";

type RecentRegistration = {
    id: string;
    eventTitle: string;
    eventCategory: string;
    userName: string;
    userEmail: string;
    status: string;
    registeredAt: string;
};

type AdminStats = {
    users: number;
    registrations: number;
    events: number;
    recentRegistrations: RecentRegistration[];
};

export default async function AdminDashboard() {
    const stats = await getAdminStats() as AdminStats;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-orbitron text-white">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Users"
                    value={stats.users}
                    icon={<Users className="text-primary" />}
                />
                <StatCard
                    label="Total Registrations"
                    value={stats.registrations}
                    icon={<Activity className="text-green-400" />}
                />
                <StatCard
                    label="Total Events"
                    value={stats.events}
                    icon={<Calendar className="text-secondary" />}
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Registrations</h2>
                <div className="space-y-4">
                    {stats.recentRegistrations.length === 0 ? (
                        <p className="text-muted-foreground">No registrations yet.</p>
                    ) : (
                        stats.recentRegistrations.map((reg: RecentRegistration) => (
                            <div key={reg.id} className="flex flex-col gap-2 p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                    <p className="font-medium text-white">{reg.eventTitle}</p>
                                    <p className="text-xs text-muted-foreground">{reg.eventCategory}</p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{reg.userName} · {reg.userEmail}</span>
                                    <span>{new Date(reg.registeredAt).toLocaleString()}</span>
                                </div>
                                <span className="inline-flex w-fit items-center justify-center px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 uppercase tracking-wide">
                                    {reg.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
    return (
        <div className="bg-card border border-white/10 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <p className="text-4xl font-bold text-white mt-2">{value}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-full">
                {icon}
            </div>
        </div>
    )
}
