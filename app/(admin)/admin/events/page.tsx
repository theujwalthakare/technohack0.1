import type { ReactNode } from "react";
import Link from "next/link";
import { createAdminEvent, deleteAdminEvent, getAllEventsAdmin, toggleEventStatus } from "@/lib/actions/admin.actions";
import { Eye, EyeOff, Link2, Plus, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import { ExportButton } from "@/components/admin/ExportButton";

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

export default async function AdminEventsPage() {
    const events = await getAllEventsAdmin() as AdminEvent[];

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
            <EventsTable events={events} />
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
                                    No events found. Use the form above to create your first listing.
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
                                            <p className="text-xs text-gray-400">{event.category} · {new Date(event.dateTime).toLocaleString()}</p>
                                            <p className="text-[11px] text-gray-500">{event.venue}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-semibold">
                                    {event.registrationCount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${event.isPublished
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-yellow-500/20 text-yellow-400"
                                        }`}>
                                        {event.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <form action={async () => {
                                            "use server"
                                            await toggleEventStatus(event._id, event.isPublished)
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
                                            <span className="px-2 py-1 text-[11px] text-gray-500 border border-white/5 rounded-lg">
                                                No Link
                                            </span>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
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
