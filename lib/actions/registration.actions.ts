"use server"

import { connectToDatabase } from "@/lib/db"
import Registration from "@/lib/models/registration.model"
import Event from "@/lib/models/event.model"
import { Registration as RegistrationType } from "@/lib/models/registration.model"
import { Event as IEvent } from "@/lib/models/event.model"

// Register for an event
export async function registerForEvent(data: {
    userId: string;
    eventId: string;
    userName: string;
    userEmail: string;
    teamName?: string;
    teamMembers?: Array<{ name: string; email: string; phone: string }>;
}) {
    try {
        await connectToDatabase();

        // Check if event exists
        const event = await Event.findById(data.eventId);
        if (!event) {
            return { success: false, error: "Event not found" };
        }

        // Check if already registered
        const existing = await Registration.findOne({
            userId: data.userId,
            eventId: data.eventId
        });

        if (existing) {
            return { success: false, error: "Already registered for this event" };
        }

        // Create registration
        const registration = await Registration.create({
            ...data,
            status: "confirmed",
            paymentStatus: "pending"
        });

        return {
            success: true,
            registration: JSON.parse(JSON.stringify(registration))
        };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
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
    } catch (error: any) {
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
    } catch (error) {
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
    } catch (error) {
        return { total: 0, upcoming: 0, completed: 0, points: 0 };
    }
}
