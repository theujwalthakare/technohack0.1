import { NextResponse } from "next/server"
import { ensureAdminRole } from "@/lib/utils/admin"
import { connectToDatabase } from "@/lib/db"
import Registration from "@/lib/models/registration.model"
import { User } from "@/lib/models/user.model"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const type = url.searchParams.get("type") ?? "registrations"

    const adminResult = await ensureAdminRole()
    if (!adminResult.success) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectToDatabase()

    if (type === "users") {
        const payload = await buildUsersCsv()
        return new Response(payload, {
            headers: buildHeaders("users")
        })
    }

    const payload = await buildRegistrationsCsv(url.searchParams)
    return new Response(payload, {
        headers: buildHeaders("registrations")
    })
}

async function buildRegistrationsCsv(params: URLSearchParams) {
    const paymentParam = params.get("payment")
    const query = params.get("query")?.toLowerCase().trim() ?? ""

    const filter: Record<string, unknown> = {}
    if (paymentParam && paymentParam !== "all") {
        filter.paymentStatus = paymentParam
    }

    const registrations = await Registration.find(filter)
        .populate("eventId", "title category dateTime venue price slug")
        .sort({ registeredAt: -1 })
        .lean()

    const rows: string[][] = [[
        "Registration ID",
        "Event Title",
        "Event Category",
        "Event Date",
        "Event Venue",
        "Participant",
        "Email",
        "Team Name",
        "Team Size",
        "Status",
        "Payment Status",
        "Payment Mode",
        "Amount",
        "Amount Paid",
        "Transaction Reference",
        "Cash Code",
        "Registered At"
    ]]

    registrations.forEach((registration) => {
        const eventDoc = registration.eventId as unknown as {
            title?: string
            category?: string
            dateTime?: Date | string
            venue?: string
            price?: number
        } | null

        const normalizedEventTitle = eventDoc?.title ?? "Unknown Event"
        const haystack = [
            normalizedEventTitle,
            eventDoc?.category ?? "",
            registration.userName,
            registration.userEmail,
            registration.teamName ?? "",
            registration.paymentStatus ?? "",
            registration.status ?? ""
        ].join(" ").toLowerCase()

        if (query && !haystack.includes(query)) {
            return
        }

        rows.push([
            registration._id?.toString() ?? "",
            normalizedEventTitle,
            eventDoc?.category ?? "",
            formatDate(eventDoc?.dateTime),
            eventDoc?.venue ?? "",
            registration.userName ?? "",
            registration.userEmail ?? "",
            registration.teamName ?? "",
            Array.isArray(registration.teamMembers) ? String(registration.teamMembers.length) : "0",
            registration.status ?? "",
            registration.paymentStatus ?? "",
            registration.paymentMode ?? "",
            String(eventDoc?.price ?? ""),
            String(registration.amountPaid ?? ""),
            registration.transactionReference ?? "",
            registration.cashCode ?? "",
            formatDate(registration.registeredAt)
        ])
    })

    return toCsv(rows)
}

async function buildUsersCsv() {
    const [users, registrationBuckets] = await Promise.all([
        User.find({}).sort({ createdAt: -1 }).lean(),
        Registration.aggregate<{ _id: string; registrations: number }>([
            {
                $group: {
                    _id: "$userId",
                    registrations: { $sum: 1 }
                }
            }
        ])
    ])

    const countMap = new Map<string, number>()
    registrationBuckets.forEach((bucket) => {
        if (typeof bucket._id === "string") {
            countMap.set(bucket._id, bucket.registrations)
        }
    })

    const rows: string[][] = [[
        "Full Name",
        "Email",
        "Role",
        "College",
        "Phone",
        "Course",
        "Year",
        "Created At",
        "Last Login",
        "Login Count",
        "Is Active",
        "Is Banned",
        "Registrations"
    ]]

    users.forEach((user) => {
        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
        rows.push([
            fullName,
            user.email ?? "",
            user.role ?? "user",
            user.college ?? "",
            user.phone ?? "",
            user.course ?? "",
            user.year ?? "",
            formatDate(user.createdAt),
            formatDate(user.lastLogin),
            String(user.loginCount ?? 0),
            user.isActive === false ? "false" : "true",
            user.isBanned ? "true" : "false",
            String(countMap.get(user.clerkId) ?? 0)
        ])
    })

    return toCsv(rows)
}

function toCsv(rows: string[][]) {
    return rows
        .map((columns) => columns.map(escapeCell).join(","))
        .join("\n")
}

function escapeCell(value: string) {
    const safeValue = value ?? ""
    if (/[",\n]/.test(safeValue)) {
        return `"${safeValue.replace(/"/g, '""')}"`
    }
    return safeValue
}

function formatDate(value: unknown) {
    if (!value) return ""
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? "" : value.toISOString()
    }
    if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? "" : date.toISOString()
    }
    return ""
}

function buildHeaders(prefix: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    return {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${prefix}-export-${timestamp}.csv`
    }
}
