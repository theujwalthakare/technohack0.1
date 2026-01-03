"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { beginGlobalLoading, endGlobalLoading } from "@/lib/utils/global-loading"

type ExportType = "registrations" | "users"

type AdminExportMenuProps = {
    query?: string
    payment?: string
    className?: string
}

export function AdminExportMenu({ query, payment, className }: AdminExportMenuProps) {
    const [loading, setLoading] = useState<ExportType | null>(null)

    const handleExport = async (type: ExportType) => {
        try {
            beginGlobalLoading()
            setLoading(type)
            const params = new URLSearchParams({ type })
            if (type === "registrations") {
                if (query) params.set("query", query)
                if (payment && payment !== "all") params.set("payment", payment)
            }

            const response = await fetch(`/api/admin/exports?${params.toString()}`, {
                method: "GET",
                cache: "no-store"
            })

            if (!response.ok) {
                throw new Error("Failed to export data")
            }

            const blob = await response.blob()
            const filename = extractFilename(response.headers.get("content-disposition")) ?? `${type}-export.csv`
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error)
            alert("Unable to export data right now. Please try again.")
        } finally {
            setLoading(null)
            endGlobalLoading()
        }
    }

    return (
        <div className={cn("flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-[#06060d] p-4", className)}>
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Data Export</p>
                <p className="text-sm text-gray-400">Download snapshots of registrations or the full user directory.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                    type="button"
                    onClick={() => handleExport("registrations")}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60"
                    disabled={loading !== null}
                >
                    {loading === "registrations" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export Registrations
                </button>
                <button
                    type="button"
                    onClick={() => handleExport("users")}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,209,197,0.35)] hover:opacity-90 disabled:opacity-60"
                    disabled={loading !== null}
                >
                    {loading === "users" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Export Users
                </button>
            </div>
        </div>
    )
}

function extractFilename(disposition: string | null) {
    if (!disposition) return null
    const match = /filename=([^;]+)/i.exec(disposition)
    if (!match) return null
    return match[1].replace(/"/g, "").trim()
}
