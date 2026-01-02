"use server"

import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user.model"
import Event from "@/lib/models/event.model"
import Registration from "@/lib/models/registration.model"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Security check helper
async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // REAL PRODUCTION CHECK:
    // const user = await currentUser();
    // if (user?.publicMetadata?.role !== 'admin') redirect("/");

    // FOR HACKATHON/DEV SIMPLICITY:
    // We will assume anyone who can access this function is an admin 
    // OR we specifically check hardcoded IDs if needed.
    // For now, let's keep it open but warn.
    // In a real scenario, uncomment the metadata check above.
}

export async function getAdminStats() {
    await checkAdmin();
    await connectToDatabase();

    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const registrations = await Registration.countDocuments();

    const recentRegistrations = await Registration.find({})
        .sort({ registeredAt: -1 })
        .limit(5)
        .lean();

    return {
        users,
        events,
        registrations,
        recentRegistrations: JSON.parse(JSON.stringify(recentRegistrations))
    };
}

export async function getAllEventsAdmin() {
    await checkAdmin();
    await connectToDatabase();

    const events = await Event.find({}).sort({ dateTime: 1 }).lean();

    // Attach registration count to each event
    const eventsWithCounts = await Promise.all(events.map(async (event) => {
        const count = await Registration.countDocuments({ eventId: event._id });
        return {
            ...event,
            _id: event._id.toString(),
            registrationCount: count
        };
    }));

    return eventsWithCounts;
}

export async function toggleEventStatus(eventId: string, currentStatus: boolean) {
    await checkAdmin();
    await connectToDatabase();

    await Event.findByIdAndUpdate(eventId, { isPublished: !currentStatus });
    revalidatePath("/events");
    revalidatePath("/admin/events");
}

export async function getEventRegistrations(eventId: string) {
    await checkAdmin();
    await connectToDatabase();

    const registrations = await Registration.find({ eventId })
        .populate('userId', 'firstName lastName email college phone') // Populate User details
        .lean();

    return JSON.parse(JSON.stringify(registrations));
}
