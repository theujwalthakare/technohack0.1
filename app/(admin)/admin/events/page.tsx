import type { ReactNode } from "react";
import Link from "next/link";
import { createAdminEvent, deleteAdminEvent, getAllEventsAdmin, toggleEventStatus } from "@/lib/actions/admin.actions";
import { Eye, EyeOff, Link2, Plus, Trash2, Pencil, Filter, Search } from "lucide-react";
import Image from "next/image";
import { ExportButton } from "@/components/admin/ExportButton";
import { cn } from "@/lib/utils";

type AdminEvent = {
    _id: string;
    title: string;
    image: string;
    category: string;
    registrationCount: number;
    isPublished: boolean;
    venue: string;
    dateTime: string | Date;
    whatsappLink?: string;
};

const modeOptions = ["Offline", "Online", "Hybrid", "Mobile"];
const inputClass = "w-full rounded-xl border border-white/10 bg-[#04040a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
});

type EventsPageSearchParams = {
    query?: string;
    status?: string;
};

export default async function AdminEventsPage({ searchParams }: { searchParams?: Promise<EventsPageSearchParams> }) {
    const events = await getAllEventsAdmin() as AdminEvent[];
    const resolvedSearchParams = (await searchParams) ?? {};
    const filters = {
        query: typeof resolvedSearchParams?.query === "string" ? resolvedSearchParams.query : "",
        status: typeof resolvedSearchParams?.status === "string" ? resolvedSearchParams.status : "all"
    };

    const filteredEvents = events.filter((event) => {
        const matchesQuery = filters.query
            ? [event.title, event.category, event.venue]
                .join(" ")
                .toLowerCase()
                .includes(filters.query.toLowerCase())
            : true;
        const matchesStatus = filters.status === "all"
            ? true
            : filters.status === "published"
                ? event.isPublished
                : !event.isPublished;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Control</p>
                <h1 className="text-3xl sm:text-4xl font-bold font-orbitron text-white">Event Management</h1>
                <p className="text-sm text-gray-400 max-w-3xl">
                    Publish new experiences, pair them with WhatsApp communities, and prune legacy listings from the same panel.
                </p>
            </div>

            <CreateEventForm />
            <EventsFilters query={filters.query} status={filters.status} />
            <ResponsiveEventsView
                events={filteredEvents}
                hasFiltersApplied={Boolean(filters.query) || filters.status !== "all"}
                totalCount={events.length}
            />
        </div>
    );
}

function EventsFilters({ query, status }: { query: string; status: string }) {
    return (
        <form className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-[#080813] border border-white/10 rounded-2xl p-4" method="get">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-300" />
                <input
                    name="query"
                    defaultValue={query}
                    placeholder="Search title, venue, or category"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300" />
                    <select
                        name="status"
                        defaultValue={status}
                        className="appearance-none rounded-xl border border-white/10 bg-white/5 pl-10 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="all">All statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold"
                >
                    Apply
                </button>
                {(query || status !== "all") && (
                    <Link
                        href="/admin/events"
                        className="px-4 py-2.5 rounded-xl border border-white/15 text-sm text-white/70 hover:text-white"
                    >
                        Reset
                    </Link>
                )}
            </div>
        </form>
    );
}

function ResponsiveEventsView({ events, hasFiltersApplied, totalCount }: { events: AdminEvent[]; hasFiltersApplied: boolean; totalCount: number }) {
    if (events.length === 0) {
        return (
            <div className="bg-[#080813] border border-white/10 rounded-2xl p-8 text-center text-sm text-gray-400">
                {hasFiltersApplied ? (
                    <p>No events match the current filters.</p>
                ) : (
                    <p>No events found. Use the form above to create your first listing.</p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Showing {events.length} of {totalCount} events
            </p>
            <div className="hidden md:block">
                <EventsTable events={events} />
            </div>
            <div className="space-y-4 md:hidden">
                {events.map((event) => (
                    <MobileEventCard key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
}

function EventsTable({ events }: { events: AdminEvent[] }) {
    return (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Registrations</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {events.length === 0 && (
                            <tr>
                                <td className="px-6 py-10 text-center text-gray-400" colSpan={4}>
                                    No events match your filters.
                                </td>
                            </tr>
                        )}
                        {events.map((event) => (
                            <tr key={event._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={event.image} alt={event.title} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{event.title}</p>
                                            <p className="text-xs text-gray-400">{event.category} · {formatEventDate(event.dateTime)}</p>
                                            <p className="text-[11px] text-gray-500">{event.venue}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-semibold">
                                    {event.registrationCount}
                                </td>
                                <td className="px-6 py-4">
                                    <EventStatusBadge isPublished={event.isPublished} />
                                </td>
                                <td className="px-6 py-4">
                                    <EventActions event={event} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MobileEventCard({ event }: { event: AdminEvent }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#080813] p-4 space-y-4">
            <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-semibold text-white line-clamp-2">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.category} · {formatEventDate(event.dateTime)}</p>
                    <p className="text-[11px] text-gray-500">{event.venue}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Signups</p>
                    <p className="text-2xl font-semibold text-white">{event.registrationCount}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-center">
                    <EventStatusBadge isPublished={event.isPublished} />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                {event.whatsappLink ? (
                    <a href={event.whatsappLink} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-100">
                        Community link ↗
                    </a>
                ) : (
                    <span>No WhatsApp link</span>
                )}
                <span className="text-white/70 font-semibold">Happens {formatEventDate(event.dateTime)}</span>
            </div>
            <EventActions event={event} compact />
        </div>
    );
}

function EventStatusBadge({ isPublished }: { isPublished: boolean }) {
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${isPublished
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-amber-500/20 text-amber-200"
            }`}>
            {isPublished ? "Published" : "Draft"}
        </span>
    );
}

function EventActions({ event, compact }: { event: AdminEvent; compact?: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-2",
            compact ? "justify-start flex-wrap" : "justify-end"
        )}>
            <form action={async () => {
                "use server";
                await toggleEventStatus(event._id, event.isPublished);
            }}>
                <button
                    type="submit"
                    className="p-2 rounded-lg border border-white/5 hover:border-white/20 text-gray-300 hover:text-white transition"
                    title="Toggle Visibility"
                >
                    {event.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </form>

            {event.whatsappLink ? (
                <a
                    href={event.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 transition"
                    title="Open WhatsApp group"
                >
                    <Link2 size={18} />
                </a>
            ) : (
                !compact && (
                    <span className="px-2 py-1 text-[11px] text-gray-500 border border-white/5 rounded-lg">
                        No Link
                    </span>
                )
            )}

            <ExportButton eventId={event._id} eventTitle={event.title} />

            <Link
                href={`/admin/events/${event._id}`}
                className="p-2 rounded-lg border border-white/10 text-gray-200 hover:text-white hover:border-white/40 transition"
                title="Edit event"
            >
                <Pencil size={18} />
            </Link>

            <form action={deleteAdminEvent}>
                <input type="hidden" name="eventId" value={event._id} />
                <button
                    type="submit"
                    className="p-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 transition"
                    title="Delete event"
                >
                    <Trash2 size={18} />
                </button>
            </form>
        </div>
    );
}

function formatEventDate(input: AdminEvent["dateTime"]) {
    try {
        return eventDateFormatter.format(new Date(input));
    } catch {
        return "TBD";
    }
}

function CreateEventForm() {
    return (
        <div className="bg-[#080813] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-[0.3em]">
                    <Plus size={14} />
                    New Event
                </div>
                <h2 className="text-2xl font-semibold text-white">Launch a fresh experience</h2>
                <p className="text-sm text-gray-400">Provide the essentials and we will publish it across the public site, dashboard, and analytics once saved.</p>
            </div>
            <form action={createAdminEvent} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" required>
                        <input name="title" placeholder="Pocket Cinema" required className={inputClass} />
                    </Field>
                    <Field label="Slug" hint="auto-generated if blank">
                        <input name="slug" placeholder="pocket-cinema" className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Category" required>
                        <input name="category" placeholder="Creative Media" required className={inputClass} />
                    </Field>
                    <Field label="Image URL" required>
                        <input name="image" type="url" placeholder="https://images.unsplash..." required className={inputClass} />
                    </Field>
                </div>

                <Field label="Short Description" required>
                    <textarea name="description" placeholder="Describe the event experience" required className={`${inputClass} h-24`} />
                </Field>

                <Field label="Rules / Format">
                    <textarea name="rules" placeholder="Bulleted rules, judging criteria, round info" className={`${inputClass} h-32`} />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Date & Time" required>
                        <input name="dateTime" type="datetime-local" required className={inputClass} />
                    </Field>
                    <Field label="Venue" required>
                        <input name="venue" placeholder="Seminar Hall" required className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Price (₹)">
                        <input name="price" type="number" min="0" defaultValue={50} className={inputClass} />
                    </Field>
                    <Field label="Team Size">
                        <input name="teamSize" type="number" min="1" defaultValue={1} className={inputClass} />
                    </Field>
                    <Field label="First Prize (₹)">
                        <input name="firstPrize" type="number" min="0" defaultValue={2000} className={inputClass} />
                    </Field>
                    <Field label="Second Prize (₹)">
                        <input name="secondPrize" type="number" min="0" defaultValue={1000} className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Mode" required>
                        <select name="mode" className={inputClass} defaultValue="Offline" required>
                            {modeOptions.map((mode) => (
                                <option key={mode} value={mode}>{mode}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="WhatsApp Group Link">
                        <input name="whatsappLink" type="url" placeholder="https://chat.whatsapp.com/..." className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Coordinator Name" required>
                        <input name="coordinatorName" placeholder="Akshay Somvanshi" required className={inputClass} />
                    </Field>
                    <Field label="Coordinator Phone" required>
                        <input name="coordinatorPhone" placeholder="7774951438" required className={inputClass} />
                    </Field>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="certificates" value="true" defaultChecked className="accent-cyan-500" />
                        Certificates Provided
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="isPublished" value="true" className="accent-green-500" />
                        Publish immediately
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Save Event
                </button>
            </form>
        </div>
    );
}

function Field({ label, hint, children, required }: { label: string; hint?: string; children: ReactNode; required?: boolean }) {
    return (
        <label className="flex flex-col gap-2 text-sm text-gray-300">
            <span className="flex items-center gap-2 text-white/80">
                {label}
                {required && <span className="text-red-400">*</span>}
                {hint && <span className="text-[11px] text-gray-500">{hint}</span>}
            </span>
            {children}
        </label>
    );
}
