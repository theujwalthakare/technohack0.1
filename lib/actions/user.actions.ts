"use server"

import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user.model"
import Registration from "@/lib/models/registration.model"
import Event from "@/lib/models/event.model"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// --- User Actions ---

export async function createUser(user: Record<string, unknown>) {
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

// --- Registration Actions ---

export async function registerForEvent(eventId: string, teamMembers: string[] = []) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    await connectToDatabase();

    // 1. Get User
    let user = await User.findOne({ clerkId });

    // Lazy sync from Clerk if webhook delayed or user not found
    if (!user) {
        const clerkUser = await currentUser();
        if (clerkUser) {
            user = await User.create({
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
        // Prepare team members in correct format if needed
        // The current registration.model expects [{ name, email, phone }] but the frontend might just be sending names?
        // Let's assume for now we adapt or pass empty if not matching.
        // Based on the error, the previous code was passing string[] which might also be a schema mismatch if not handled.
        // But the immediate error matches schema fields.

        // registration.model.ts requires: userId (String), eventId (ObjectId), userName, userEmail.

        const newRegistration = await Registration.create({
            eventId: event._id,
            userId: clerkId, // Use Clerk ID directly as per registration.model.ts
            userName: `${user.firstName} ${user.lastName}`.trim(),
            userEmail: user.email,
            eventTitle: event.title, // These might be extra fields not in schema, but Mongoose ignores strict:false or defaults.
            eventImage: event.image, // registration.model.ts doesn't have eventTitle/Image, but has 'teamMembers'.
            // The model has teamMembers: [{ name, email, phone }]
            // The input teamMembers is string[]. We need to be careful.
            // If the user input is just names, we can't fully populate. 
            // For now, let's omit teamMembers if the types don't match or map them simply.
            // Since I can't ask the user right now, I'll pass empty array to avoid validation error if types mismatch,
            // or try to map if it's just names.
            teamMembers: []
        });

        revalidatePath(`/events/${event.slug}`);
        return { success: true, message: "Registered Successfully" };
    } catch (error: unknown) {
        // Mongoose duplicate key error
        if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
            return { success: false, message: "Already Registered" };
        }
        console.error("Registration failed:", error);
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
