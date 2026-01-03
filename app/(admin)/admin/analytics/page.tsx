import type { ReactNode } from "react";
import { getAdminAnalytics } from "@/lib/actions/admin.actions";
import { TrendingUp, Target, PieChart, Activity } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
});

export default async function AdminAnalyticsPage() {
    const data = await getAdminAnalytics();
    const { overview, topEvents, categoryDistribution, dailyRegistrations } = data;

    const maxCategoryCount = Math.max(1, ...categoryDistribution.map((item) => item.count));
    const maxDailyCount = Math.max(1, ...dailyRegistrations.map((item) => item.count));

    return (
        <div className="space-y-10">
            <section className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Telemetry</p>
                <h1 className="text-4xl font-black font-orbitron text-white">
                    Event Intelligence
                </h1>
                <p className="text-sm text-gray-400 max-w-2xl">
                    Monitor revenue, participation momentum, and audience interests in real time.
                    These insights update whenever registrations flow through the unified API.
                </p>
            </section>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <AnalyticsCard
                    label="Total Revenue"
                    value={currencyFormatter.format(overview.totalRevenue)}
                    subLabel="Gross across published events"
                    accent="from-amber-500/60 to-orange-500/20"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <AnalyticsCard
                    label="Registrations"
                    value={numberFormatter.format(overview.totalRegistrations)}
                    subLabel="Unique submissions"
                    accent="from-cyan-500/60 to-blue-500/20"
                    icon={<Activity className="w-5 h-5" />}
                />
                <AnalyticsCard
                    label="Avg / Event"
                    value={overview.avgRegistrationsPerEvent.toFixed(1)}
                    subLabel="Registrations per published event"
                    accent="from-fuchsia-500/60 to-purple-500/20"
                    icon={<Target className="w-5 h-5" />}
                />
                <AnalyticsCard
                    label="Active Events"
                    value={numberFormatter.format(overview.activeEvents)}
                    subLabel="Generating traction now"
                    accent="from-emerald-500/60 to-teal-500/20"
                    icon={<PieChart className="w-5 h-5" />}
                />
            </section>

            <section className="grid gap-8 xl:grid-cols-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_20px_45px_rgb(15,15,35,0.35)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-white">Top Performing Events</h2>
                            <p className="text-sm text-gray-400">Sorted by live registrations</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300">
                            Live feed
                        </span>
                    </div>
                    {topEvents.length === 0 ? (
                        <p className="text-gray-400 text-sm">No registrations yet.</p>
                    ) : (
                        <div className="space-y-5">
                            {topEvents.map((event, index) => {
                                const ratio = topEvents[0].registrations ? event.registrations / topEvents[0].registrations : 0;
                                return (
                                    <div key={event.eventId} className="border border-white/5 rounded-xl p-4 bg-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-semibold text-white">{event.title}</p>
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">{event.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-cyan-200">{event.registrations}</p>
                                                <p className="text-xs text-gray-500">{currencyFormatter.format(event.revenue)}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                                                style={{ width: `${Math.max(ratio * 100, 6)}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] mt-2 text-gray-500 uppercase tracking-[0.3em]">Rank {index + 1}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid gap-8">
                    <div className="bg-[#090914] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                        <div className="relative">
                            <h2 className="text-2xl font-semibold text-white">Category Mix</h2>
                            <p className="text-sm text-gray-400 mb-4">Where participants spend their time</p>
                            <div className="space-y-4">
                                {categoryDistribution.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No categories to display.</p>
                                ) : (
                                    categoryDistribution.map((item) => (
                                        <div key={item.category}>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white font-medium">{item.category}</span>
                                                <span className="text-gray-400">{item.count} regs</span>
                                            </div>
                                            <div className="mt-2 h-10 rounded-lg border border-white/5 bg-white/5 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                                                    style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-white">Daily Flow</h2>
                                <p className="text-sm text-gray-400">Registrations per day</p>
                            </div>
                            <span className="text-xs uppercase tracking-[0.25em] text-green-300">LIVE</span>
                        </div>
                        {dailyRegistrations.length === 0 ? (
                            <p className="text-gray-400 text-sm">Data populates after first registration.</p>
                        ) : (
                            <div className="flex items-end gap-2 h-40">
                                {dailyRegistrations.map((point) => (
                                    <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full rounded-full bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500"
                                            style={{ height: `${(point.count / maxDailyCount) * 100}%` }}
                                        />
                                        <p className="text-[10px] text-gray-500">
                                            {new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function AnalyticsCard({
    label,
    value,
    subLabel,
    accent,
    icon
}: {
    label: string;
    value: string;
    subLabel: string;
    accent: string;
    icon: ReactNode;
}) {
    return (
        <div className="bg-[#07070f] border border-white/10 rounded-2xl p-5 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}></div>
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">{label}</p>
                    <p className="text-3xl font-black text-white mt-3">{value}</p>
                    <p className="text-xs text-white/70 mt-2">{subLabel}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white">
                    {icon}
                </div>
            </div>
        </div>
    );
}
