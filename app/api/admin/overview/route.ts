import { NextResponse } from "next/server"
import { ensureAdminRole } from "@/lib/utils/admin"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user.model"
import Event from "@/lib/models/event.model"
import Registration from "@/lib/models/registration.model"

export async function GET() {
    const authResult = await ensureAdminRole()

    if (!authResult.success) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const [users, events, registrations, recentRegistrations] = await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Registration.countDocuments(),
        Registration.find({})
            .sort({ registeredAt: -1 })
            .limit(5)
            .populate("eventId", "title category")
            .lean()
    ])

    const normalizedRecent = recentRegistrations.map((entry) => {
        const eventDoc = entry.eventId as { title?: string | null; category?: string | null } | undefined
        const registeredAtValue = entry.registeredAt instanceof Date
            ? entry.registeredAt.toISOString()
            : new Date(entry.registeredAt).toISOString()
        return {
            id: entry._id.toString(),
            eventTitle: eventDoc?.title ?? "Event",
            eventCategory: eventDoc?.category ?? "General",
            userName: entry.userName,
            userEmail: entry.userEmail,
            status: entry.status,
            registeredAt: registeredAtValue
        }
    })

    return NextResponse.json({
        stats: {
            users,
            events,
            registrations
        },
        recentRegistrations: normalizedRecent
    })
}
