import type { ReactNode } from "react";
import Link from "next/link";
import { PaymentStatusControls } from "@/components/admin/PaymentStatusControls";
import { AdminExportMenu } from "@/components/admin/AdminExportMenu";
import { getAdminRegistrations, type AdminRegistrationEntry, type PaymentStatus } from "@/lib/actions/admin.actions";
import { Activity, AlertTriangle, CheckCircle2, Clock3, ReceiptIndianRupee, Filter, Search } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
});

type RegistrationsSearchParams = {
    query?: string;
    payment?: string;
};

const paymentFilterOptions: Array<PaymentStatus | "all"> = ["all", "completed", "pending", "failed"];

export default async function AdminRegistrationsPage({ searchParams }: { searchParams?: RegistrationsSearchParams }) {
    const { stats, registrations } = await getAdminRegistrations();
    const query = typeof searchParams?.query === "string" ? searchParams.query : "";
    const rawPayment = typeof searchParams?.payment === "string" ? searchParams.payment : "all";
    const paymentFilter: PaymentStatus | "all" = paymentFilterOptions.includes(rawPayment as PaymentStatus | "all")
        ? (rawPayment as PaymentStatus | "all")
        : "all";

    const filteredRegistrations = registrations.filter((registration) => {
        const matchesQuery = query
            ? [
                registration.eventTitle,
                registration.eventCategory,
                registration.userName,
                registration.userEmail,
                registration.teamName ?? "",
                registration.paymentMode ?? ""
            ]
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
            : true;

        const matchesPayment = paymentFilter === "all"
            ? true
            : registration.paymentStatus === paymentFilter;

        return matchesQuery && matchesPayment;
    });

    const cards = [
        {
            label: "Total Registrations",
            value: stats.totalRegistrations,
            description: "Across every published event",
            icon: <Activity className="w-5 h-5" />,
            accent: "from-cyan-500/60 via-blue-500/10 to-transparent"
        },
        {
            label: "Verified Payments",
            value: stats.paid,
            description: "Marked as completed",
            icon: <CheckCircle2 className="w-5 h-5" />,
            accent: "from-emerald-500/60 via-teal-500/10 to-transparent"
        },
        {
            label: "Pending Payments",
            value: stats.pendingPayments,
            description: "Awaiting verification",
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

            <RegistrationFilters query={query} payment={paymentFilter} />
            <AdminExportMenu query={query} payment={paymentFilter} />

            <section className="grid gap-5 xl:grid-cols-3">
                <div className="bg-[#07070f] border border-white/10 rounded-2xl p-5 space-y-4 xl:col-span-2">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Latest Activity</h2>
                            <p className="text-xs text-white/60">Showing {filteredRegistrations.length} of {registrations.length} entries</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-green-300">Live Feed</span>
                    </div>
                    <ResponsiveRegistrationsView
                        registrations={filteredRegistrations}
                        hasFiltersApplied={Boolean(query) || paymentFilter !== "all"}
                    />
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

function RegistrationFilters({ query, payment }: { query: string; payment: PaymentStatus | "all" }) {
    return (
        <form className="bg-[#07070f] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between" method="get">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-200" />
                <input
                    name="query"
                    defaultValue={query}
                    placeholder="Search event, participant, or email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200" />
                    <select
                        name="payment"
                        defaultValue={payment}
                        className="appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        {paymentFilterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option === "all" ? "All payments" : option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold"
                >
                    Apply
                </button>
                {(query || payment !== "all") && (
                    <Link
                        href="/admin/registrations"
                        className="px-4 py-2.5 rounded-xl border border-white/15 text-sm text-white/70 hover:text-white"
                    >
                        Reset
                    </Link>
                )}
            </div>
        </form>
    );
}

function ResponsiveRegistrationsView({ registrations, hasFiltersApplied }: { registrations: AdminRegistrationEntry[]; hasFiltersApplied: boolean }) {
    if (registrations.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#05050b] p-8 text-center text-sm text-gray-400">
                {hasFiltersApplied ? "No registrations match those filters." : "No registrations recorded yet."}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="hidden lg:block">
                <RegistrationsTable registrations={registrations} />
            </div>
            <div className="grid gap-4 lg:hidden max-h-[70vh] overflow-y-auto pr-1">
                {registrations.map((registration) => (
                    <RegistrationCard key={registration.id} registration={registration} />
                ))}
            </div>
        </div>
    );
}

function RegistrationsTable({ registrations }: { registrations: AdminRegistrationEntry[] }) {
    return (
        <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                        <th className="px-4 py-3 text-left">Event</th>
                        <th className="px-4 py-3 text-left">Participant</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Payment Details</th>
                        <th className="px-4 py-3 text-right">Fee</th>
                        <th className="px-4 py-3 text-right">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {registrations.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                No registrations match your filters.
                            </td>
                        </tr>
                    )}
                    {registrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4 align-top">
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
                            <td className="px-4 py-4 text-gray-300 align-top">
                                <p className="font-semibold text-white">{registration.userName}</p>
                                <p className="text-xs text-gray-400">{registration.userEmail}</p>
                                {registration.teamName && (
                                    <p className="text-xs text-gray-500">Team: {registration.teamName} ({registration.teamSize})</p>
                                )}
                            </td>
                            <td className="px-4 py-4 align-top">
                                <StatusBadge status={registration.status} />
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="space-y-2 text-xs text-gray-300">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <PaymentBadge status={registration.paymentStatus} />
                                        <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] uppercase tracking-wide text-white/70">
                                            {formatPaymentMode(registration.paymentMode)}
                                        </span>
                                    </div>
                                    <p className="text-gray-400">
                                        <span className="text-white/80 font-semibold">Paid:</span> {currencyFormatter.format(registration.amountPaid)}
                                    </p>
                                    <p className="text-gray-400 break-all">
                                        <span className="text-white/80 font-semibold">Reference:</span> {registration.paymentMode === "upi" ? (registration.transactionReference || "—") : "Cash submissions auto-generate codes"}
                                    </p>
                                    {registration.paymentMode === "cash" && (
                                        <p className="text-amber-200 break-all">
                                            <span className="text-white/80 font-semibold">Cash Code:</span> {registration.cashCode || "—"}
                                        </p>
                                    )}
                                    {registration.paymentProofUrl ? (
                                        <a
                                            href={registration.paymentProofUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            download={`payment-proof-${registration.id}.png`}
                                            className="text-[11px] text-cyan-300 hover:text-cyan-200"
                                        >
                                            View proof ↗
                                        </a>
                                    ) : (
                                        <p className="text-[11px] text-gray-500">No proof uploaded</p>
                                    )}
                                    <PaymentStatusControls
                                        registrationId={registration.id}
                                        paymentStatus={registration.paymentStatus}
                                    />
                                </div>
                            </td>
                            <td className="px-4 py-4 text-right text-white font-semibold align-top">
                                {currencyFormatter.format(registration.amount)}
                            </td>
                            <td className="px-4 py-4 text-right text-gray-300 align-top">
                                {formatDate(registration.registeredAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RegistrationCard({ registration }: { registration: AdminRegistrationEntry }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#05050b] p-4 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-lg font-semibold text-white line-clamp-2">{registration.eventTitle}</p>
                    <p className="text-xs text-gray-400">{registration.eventCategory}</p>
                    {registration.eventSlug && (
                        <Link href={`/events/${registration.eventSlug}`} className="text-[11px] text-cyan-300 hover:text-cyan-100">
                            View public page ↗
                        </Link>
                    )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <StatusBadge status={registration.status} />
                    <PaymentBadge status={registration.paymentStatus} />
                </div>
            </div>

            <div className="space-y-1 text-sm text-gray-300">
                <p className="text-white font-semibold">{registration.userName}</p>
                <p className="text-xs text-gray-400 break-all">{registration.userEmail}</p>
                {registration.teamName && (
                    <p className="text-xs text-gray-500">Team {registration.teamName} ({registration.teamSize})</p>
                )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/15 px-3 py-1">{formatPaymentMode(registration.paymentMode)}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Fee {currencyFormatter.format(registration.amount)}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Registered {formatDate(registration.registeredAt)}</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-300 space-y-2">
                <p>
                    <span className="text-white/80 font-semibold">Paid:</span> {currencyFormatter.format(registration.amountPaid)}
                </p>
                <p className="break-all">
                    <span className="text-white/80 font-semibold">Reference:</span> {registration.paymentMode === "upi" ? (registration.transactionReference || "—") : "Cash submissions auto-generate codes"}
                </p>
                {registration.paymentMode === "cash" && (
                    <p className="text-amber-200">
                        <span className="text-white/80 font-semibold">Cash Code:</span> {registration.cashCode || "—"}
                    </p>
                )}
                {registration.paymentProofUrl ? (
                    <a
                        href={registration.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={`payment-proof-${registration.id}.png`}
                        className="text-cyan-300 hover:text-cyan-100"
                    >
                        View proof ↗
                    </a>
                ) : (
                    <p className="text-gray-500">No proof uploaded</p>
                )}
            </div>

            <PaymentStatusControls
                registrationId={registration.id}
                paymentStatus={registration.paymentStatus}
            />
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

function PaymentBadge({ status }: { status?: PaymentStatus }) {
    const palette: Record<PaymentStatus, string> = {
        completed: "bg-emerald-500/20 text-emerald-200",
        pending: "bg-amber-500/20 text-amber-200",
        failed: "bg-rose-500/20 text-rose-200"
    };
    const iconMap: Record<PaymentStatus, ReactNode> = {
        completed: <CheckCircle2 className="w-3.5 h-3.5" />,
        pending: <Clock3 className="w-3.5 h-3.5" />,
        failed: <AlertTriangle className="w-3.5 h-3.5" />
    };

    const normalized: PaymentStatus = status ?? "pending";
    const color = palette[normalized];
    const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
            {iconMap[normalized]}
            {label}
        </span>
    );
}

function formatDate(input?: string) {
    if (!input) return "—";
    return dateFormatter.format(new Date(input));
}

function formatPaymentMode(mode?: string) {
    if (mode === "cash") return "Cash";
    return "UPI";
}
