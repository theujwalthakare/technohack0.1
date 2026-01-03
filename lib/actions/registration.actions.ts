"use server"

import { connectToDatabase } from "@/lib/db"
import Registration from "@/lib/models/registration.model"
import Event from "@/lib/models/event.model"
import { Event as IEvent } from "@/lib/models/event.model"
import { auth, currentUser } from "@clerk/nextjs/server"
import { User } from "@/lib/models/user.model"

type TeamMemberInput = { name?: string; email?: string; phone?: string }

// Register the currently authenticated user for an event
export async function registerCurrentUserForEvent({
    eventId,
    teamName,
    teamMembers = []
}: {
    eventId: string
    teamName?: string
    teamMembers?: TeamMemberInput[]
}) {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
        return { success: false, message: "Unauthorized" }
    }

    try {
        await connectToDatabase()

        let user = await User.findOne({ clerkId })

        if (!user) {
            const clerkProfile = await currentUser()
            if (!clerkProfile) {
                return { success: false, message: "User not found" }
            }

            user = await User.create({
                clerkId,
                email: clerkProfile.emailAddresses[0]?.emailAddress,
                firstName: clerkProfile.firstName,
                lastName: clerkProfile.lastName,
                imageUrl: clerkProfile.imageUrl
            })
        }

        const event = await Event.findById(eventId)
        if (!event) {
            return { success: false, message: "Event not found" }
        }

        const alreadyRegistered = await Registration.findOne({ userId: clerkId, eventId: event._id })
        if (alreadyRegistered) {
            return { success: false, message: "Already registered for this event" }
        }

        const sanitizedTeamMembers = (teamMembers || [])
            .map(member => ({
                name: member.name?.trim() || undefined,
                email: member.email?.trim() || undefined,
                phone: member.phone?.trim() || undefined
            }))
            .filter(member => member.name || member.email || member.phone)

        const registration = await Registration.create({
            userId: clerkId,
            eventId: event._id,
            userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
            userEmail: user.email,
            teamName: teamName?.trim() || undefined,
            teamMembers: sanitizedTeamMembers,
            status: "confirmed",
            paymentStatus: "pending"
        })

        return {
            success: true,
            registration: JSON.parse(JSON.stringify(registration))
        }
    } catch (error: unknown) {
        console.error("Registration error:", error)
        const message = error instanceof Error ? error.message : "Registration failed"
        return { success: false, message }
    }
}

// Get user's registrations
export async function getUserRegistrations(userId: string) {
    try {
        await connectToDatabase();

        const registrations = await Registration.find({ userId })
            .populate("eventId")
            .sort({ registeredAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(registrations));
    } catch (error: unknown) {
        console.error("Error fetching registrations:", error);
        return [];
    }
}

// Check if user is registered for an event
export async function checkRegistrationStatus(userId: string, eventId: string) {
    try {
        await connectToDatabase();

        const registration = await Registration.findOne({ userId, eventId }).lean();

        return {
            isRegistered: !!registration,
            status: registration?.status || null
        };
    } catch (error: unknown) {
        console.error("Error checking registration status:", error);
        return { isRegistered: false, status: null };
    }
}

// Cancel registration
export async function cancelRegistration(userId: string, eventId: string) {
    try {
        await connectToDatabase();

        const registration = await Registration.findOneAndUpdate(
            { userId, eventId },
            { status: "cancelled", updatedAt: new Date() },
            { new: true }
        );

        if (!registration) {
            return { success: false, error: "Registration not found" };
        }

        return { success: true };
    } catch (error: unknown) {
        console.error("Error cancelling registration:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}



// ... imports

// Get registration stats for dashboard
export async function getUserStats(userId: string) {
    try {
        await connectToDatabase();

        const registrations = await Registration.find({ userId }).populate("eventId");

        const now = new Date();
        const upcoming = registrations.filter(r => {
            const event = r.eventId as unknown as IEvent;
            return event && new Date(event.dateTime) > now && r.status === "confirmed";
        });

        const completed = registrations.filter(r => {
            const event = r.eventId as unknown as IEvent;
            return event && new Date(event.dateTime) <= now;
        });

        return {
            total: registrations.length,
            upcoming: upcoming.length,
            completed: completed.length,
            points: completed.length * 50 // 50 points per completed event
        };
    } catch (error: unknown) {
        console.error("Error computing user stats:", error)
        return { total: 0, upcoming: 0, completed: 0, points: 0 };
    }
}
