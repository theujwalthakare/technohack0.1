import type { ReactNode } from "react";
import Link from "next/link";
import { getAdminRegistrations, type AdminRegistrationEntry } from "@/lib/actions/admin.actions";
import { Activity, AlertTriangle, CheckCircle2, Clock3, ReceiptIndianRupee } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
});

export default async function AdminRegistrationsPage() {
    const { stats, registrations } = await getAdminRegistrations();

    const cards = [
        {
            label: "Total Registrations",
            value: stats.totalRegistrations,
            description: "Across every published event",
            icon: <Activity className="w-5 h-5" />,
            accent: "from-cyan-500/60 via-blue-500/10 to-transparent"
        },
        {
            label: "Confirmed",
            value: stats.confirmed,
            description: "Status: confirmed",
            icon: <CheckCircle2 className="w-5 h-5" />,
            accent: "from-emerald-500/60 via-teal-500/10 to-transparent"
        },
        {
            label: "Pending",
            value: stats.pending,
            description: "Awaiting review or payment",
            icon: <Clock3 className="w-5 h-5" />,
            accent: "from-amber-500/60 via-orange-500/10 to-transparent"
        },
        {
            label: "Projected Revenue",
            value: currencyFormatter.format(stats.projectedRevenue),
            description: "Based on event pricing",
            icon: <ReceiptIndianRupee className="w-5 h-5" />,
            accent: "from-purple-500/60 via-pink-500/10 to-transparent"
        }
    ];

    return (
        <div className="space-y-10">
            <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Registrations</p>
                <h1 className="text-4xl font-bold font-orbitron text-white">Pipelines & Payments</h1>
                <p className="text-sm text-gray-400 max-w-3xl">
                    Monitor every submission, payment attempt, and waitlist status in one console. Use this page to reconcile cash collections or follow up with pending teams.
                </p>
            </header>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-3">
                <div className="bg-[#07070f] border border-white/10 rounded-2xl p-5 space-y-4 xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Latest Activity</h2>
                        <span className="text-xs uppercase tracking-[0.3em] text-green-300">Live Feed</span>
                    </div>
                    <RegistrationsTable registrations={registrations} />
                </div>
                <div className="bg-[#090914] border border-white/10 rounded-2xl p-5 space-y-4">
                    <h2 className="text-xl font-semibold text-white">Payment Health</h2>
                    <div className="space-y-3">
                        <PaymentStat label="Paid" value={stats.paid} accent="bg-emerald-500/20 text-emerald-300" />
                        <PaymentStat label="Pending" value={stats.pendingPayments} accent="bg-amber-500/20 text-amber-300" />
                        <PaymentStat label="Failed" value={stats.failedPayments} accent="bg-rose-500/20 text-rose-300" />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                        <p className="font-semibold text-white mb-1">What to do next?</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                            <li>Trigger payment reminders for pending teams.</li>
                            <li>Manually verify UPI transfers and flip to paid.</li>
                            <li>Export to CSV for finance reconciliation.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, description, icon, accent }: { label: string; value: number | string; description: string; icon: ReactNode; accent: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#06060d] p-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{label}</p>
                    <p className="text-4xl font-black text-white mt-3">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
                    <p className="text-xs text-white/70 mt-2">{description}</p>
                </div>
                <div className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center text-white">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function PaymentStat({ label, value, accent }: { label: string; value: number; accent: string }) {
    return (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${accent}`}>
            <span>{label}</span>
            <span>{value.toLocaleString("en-IN")}</span>
        </div>
    );
}

function RegistrationsTable({ registrations }: { registrations: AdminRegistrationEntry[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">Event</th>
                        <th className="px-4 py-3 text-left">Participant</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Payment</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {registrations.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                No registrations yet.
                            </td>
                        </tr>
                    )}
                    {registrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4">
                                <div className="flex flex-col">
                                    <span className="text-white font-semibold">{registration.eventTitle}</span>
                                    <span className="text-xs text-gray-400">{registration.eventCategory}</span>
                                    {registration.eventSlug && (
                                        <Link href={`/events/${registration.eventSlug}`} className="text-[11px] text-cyan-300 hover:text-cyan-200">
                                            View public page →
                                        </Link>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-4 text-gray-300">
                                <p className="font-semibold text-white">{registration.userName}</p>
                                <p className="text-xs text-gray-400">{registration.userEmail}</p>
                                {registration.teamName && (
                                    <p className="text-xs text-gray-500">Team: {registration.teamName} ({registration.teamSize})</p>
                                )}
                            </td>
                            <td className="px-4 py-4">
                                <StatusBadge status={registration.status} />
                            </td>
                            <td className="px-4 py-4">
                                <PaymentBadge status={registration.paymentStatus} />
                            </td>
                            <td className="px-4 py-4 text-right text-white font-semibold">
                                {currencyFormatter.format(registration.amount)}
                            </td>
                            <td className="px-4 py-4 text-right text-gray-300">
                                {formatDate(registration.registeredAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusBadge({ status }: { status?: string }) {
    const palette: Record<string, string> = {
        confirmed: "bg-emerald-500/20 text-emerald-300",
        pending: "bg-amber-500/20 text-amber-300",
        waitlist: "bg-indigo-500/20 text-indigo-300",
        cancelled: "bg-rose-500/20 text-rose-300"
    };

    const normalized = status || "unknown";
    const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    const color = palette[normalized] ?? "bg-white/10 text-white";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
            {label}
        </span>
    );
}

function PaymentBadge({ status }: { status?: string }) {
    const palette: Record<string, string> = {
        completed: "bg-emerald-500/20 text-emerald-200",
        pending: "bg-amber-500/20 text-amber-200",
        failed: "bg-rose-500/20 text-rose-200"
    };
    const iconMap: Record<string, ReactNode> = {
        completed: <CheckCircle2 className="w-3.5 h-3.5" />,
        pending: <Clock3 className="w-3.5 h-3.5" />,
        failed: <AlertTriangle className="w-3.5 h-3.5" />
    };

    const normalized = status || "pending";
    const color = palette[normalized] ?? "bg-white/10 text-white";
    const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
            {iconMap[normalized] ?? <AlertTriangle className="w-3.5 h-3.5" />}
            {label}
        </span>
    );
}

function formatDate(input?: string) {
    if (!input) return "—";
    return dateFormatter.format(new Date(input));
}
