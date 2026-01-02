import { getAllEventsAdmin, toggleEventStatus } from "@/lib/actions/admin.actions";
import { Eye, EyeOff, Download } from "lucide-react";
import Image from "next/image";
import { ExportButton } from "@/components/admin/ExportButton";

export default async function AdminEventsPage() {
    const events = await getAllEventsAdmin();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-orbitron text-white">Event Management</h1>
            </div>

            <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
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
                            {events.map((event: any) => (
                                <tr key={event._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                <Image src={event.image} alt="" fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{event.title}</p>
                                                <p className="text-muted-foreground text-xs">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
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
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {/* Server Action Form for Toggle */}
                                        <form action={async () => {
                                            "use server"
                                            await toggleEventStatus(event._id, event.isPublished)
                                        }} className="inline-block">
                                            <button
                                                type="submit"
                                                className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                                                title="Toggle Visibility"
                                            >
                                                {event.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </form>

                                        {/* Note: Download feature would require client component interaction */}
                                        <ExportButton eventId={event._id} eventTitle={event.title} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
