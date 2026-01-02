"use client"

import { getEventRegistrations } from "@/lib/actions/admin.actions"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

export function ExportButton({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const data = await getEventRegistrations(eventId);

            if (!data || data.length === 0) {
                alert("No registrations found for this event.");
                return;
            }

            // Flatten data for CSV
            const csvRows = [
                ["Name", "Email", "Phone", "College", "Status", "Team Members", "Registered At"]
            ];

            data.forEach((reg: any) => {
                const user = reg.userId || {};
                csvRows.push([
                    `"${user.firstName || ''} ${user.lastName || ''}"`,
                    `"${user.email || ''}"`,
                    `"${user.phone || ''}"`,
                    `"${user.college || ''}"`,
                    `"${reg.status}"`,
                    `"${reg.teamMembers ? reg.teamMembers.join(', ') : ''}"`,
                    `"${new Date(reg.registeredAt).toLocaleString()}"`
                ]);
            });

            const csvContent = csvRows.map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_registrations.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error(error);
            alert("Failed to download CSV");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white disabled:opacity-50"
            title="Export CSV"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
    )
}
