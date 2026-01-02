"use server"

import { connectToDatabase } from "@/lib/db"
import { User, Registration } from "@/lib/models/user.model"
import Event from "@/lib/models/event.model"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// --- User Actions ---

export async function createUser(user: any) {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
}

export async function getUserById(clerkId: string) {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    return JSON.parse(JSON.stringify(user));
}

// --- Registration Actions ---

export async function registerForEvent(eventId: string, teamMembers: string[] = []) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    await connectToDatabase();

    // 1. Get User
    const user = await User.findOne({ clerkId });
    if (!user) {
        // Create user if not exists (Lazy sync from Clerk if webhook delayed)
        const clerkUser = await currentUser();
        if (clerkUser) {
            await User.create({
                clerkId,
                email: clerkUser.emailAddresses[0].emailAddress,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                imageUrl: clerkUser.imageUrl
            });
        } else {
            throw new Error("User not found");
        }
    }

    // 2. Get Event
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    // 3. Create Registration
    try {
        const newRegistration = await Registration.create({
            eventId: event._id,
            userId: user._id, // Use MongoDB _id
            clerkId,
            eventTitle: event.title,
            eventImage: event.image,
            teamMembers
        });

        revalidatePath(`/events/${event.slug}`);
        return { success: true, message: "Registered Successfully" };
    } catch (error: any) {
        if (error.code === 11000) {
            return { success: false, message: "Already Registered" };
        }
        throw error;
    }
}

export async function getRegistrationStatus(eventId: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    await connectToDatabase();
    const registration = await Registration.findOne({ clerkId, eventId });

    return registration ? { status: registration.status } : null;
}
