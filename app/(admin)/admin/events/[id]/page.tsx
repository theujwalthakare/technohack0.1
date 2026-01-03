import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminEventById, updateAdminEvent } from "@/lib/actions/admin.actions";

const inputClass = "w-full rounded-xl border border-white/10 bg-[#04040a] px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";

export const dynamic = "force-dynamic";

type EditParams = Promise<{ id: string }> | { id: string };

export default async function EditAdminEventPage({ params }: { params: EditParams }) {
    const resolvedParams = await params;
    const event = await getAdminEventById(resolvedParams.id);
    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Edit</p>
                    <h1 className="text-3xl font-bold font-orbitron text-white">{event.title}</h1>
                    <p className="text-sm text-gray-400">Adjust copy, logistics, or links and publish instantly.</p>
                </div>
                <Link
                    href="/admin/events"
                    className="px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white"
                >
                    ← Back to events
                </Link>
            </div>

            <form action={updateAdminEvent} className="space-y-6 bg-[#080813] border border-white/10 rounded-2xl p-6">
                <input type="hidden" name="eventId" value={event._id} />
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title">
                        <input name="title" defaultValue={event.title} className={inputClass} />
                    </Field>
                    <Field label="Slug">
                        <input name="slug" defaultValue={event.slug} className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Category">
                        <input name="category" defaultValue={event.category} className={inputClass} />
                    </Field>
                    <Field label="Image URL">
                        <input name="image" defaultValue={event.image} className={inputClass} />
                    </Field>
                </div>

                <Field label="Short Description">
                    <textarea name="description" defaultValue={event.description} className={`${inputClass} h-24`} />
                </Field>

                <Field label="Rules / Format">
                    <textarea name="rules" defaultValue={event.rules || ""} className={`${inputClass} h-32`} />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Date & Time">
                        <input name="dateTime" type="datetime-local" defaultValue={event.dateTime?.slice(0, 16)} className={inputClass} />
                    </Field>
                    <Field label="Venue">
                        <input name="venue" defaultValue={event.venue} className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Price (₹)">
                        <input name="price" type="number" min="0" defaultValue={event.price} className={inputClass} />
                    </Field>
                    <Field label="Team Size">
                        <input name="teamSize" type="number" min="1" defaultValue={event.teamSize} className={inputClass} />
                    </Field>
                    <Field label="First Prize (₹)">
                        <input name="firstPrize" type="number" min="0" defaultValue={event.firstPrize} className={inputClass} />
                    </Field>
                    <Field label="Second Prize (₹)">
                        <input name="secondPrize" type="number" min="0" defaultValue={event.secondPrize} className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Mode">
                        <input name="mode" defaultValue={event.mode} className={inputClass} />
                    </Field>
                    <Field label="WhatsApp Group Link">
                        <input name="whatsappLink" defaultValue={event.whatsappLink || ""} className={inputClass} />
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Coordinator Name">
                        <input name="coordinatorName" defaultValue={event.coordinatorName} className={inputClass} />
                    </Field>
                    <Field label="Coordinator Phone">
                        <input name="coordinatorPhone" defaultValue={event.coordinatorPhone} className={inputClass} />
                    </Field>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="certificates" value="true" defaultChecked={event.certificates} className="accent-cyan-500" />
                        Certificates Provided
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="isPublished" value="true" defaultChecked={event.isPublished} className="accent-green-500" />
                        Published
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold"
                >
                    Save changes
                </button>
            </form>
        </div>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="flex flex-col gap-2 text-sm text-gray-300">
            <span className="text-white/80">{label}</span>
            {children}
        </label>
    );
}
