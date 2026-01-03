"use client"

import { CheckCircle2, AlertCircle, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const statusDictionary: Record<string, { title: string; message: string }> = {
    created: {
        title: "Event published",
        message: "Your new event is live everywhere."
    },
    updated: {
        title: "Changes saved",
        message: "Latest updates are synced across the site."
    },
    deleted: {
        title: "Event deleted",
        message: "Listing removed and registrations cleaned up."
    },
    toggled: {
        title: "Visibility updated",
        message: "Participants now see the latest availability."
    }
}

export function AdminActionToast() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const statusKey = searchParams.get("status") ?? undefined
    const config = useMemo(() => (statusKey ? statusDictionary[statusKey] : undefined), [statusKey])
    const [visible, setVisible] = useState<boolean>(Boolean(config))

    const clearStatusParam = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("status")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    useEffect(() => {
        if (!config) {
            setVisible(false)
            return
        }
        setVisible(true)
        const hideTimer = setTimeout(() => setVisible(false), 4000)
        const cleanupTimer = setTimeout(() => {
            clearStatusParam()
        }, 4500)
        return () => {
            clearTimeout(hideTimer)
            clearTimeout(cleanupTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config?.title])

    if (!config || !visible) return null

    const Icon = statusKey === "deleted" ? AlertCircle : CheckCircle2

    return (
        <div className="fixed right-6 top-24 z-50">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#05050a]/95 px-4 py-3 text-white shadow-2xl transition-all">
                <div className="mt-0.5 rounded-full bg-white/10 p-1.5 text-emerald-300">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-semibold">{config.title}</p>
                    <p className="text-xs text-gray-400">{config.message}</p>
                </div>
                <button
                    type="button"
                    aria-label="Dismiss"
                    className="ml-4 text-gray-400 hover:text-white"
                    onClick={() => {
                        setVisible(false)
                        clearStatusParam()
                    }}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
