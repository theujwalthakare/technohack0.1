"use server"

import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user.model"
import Registration from "@/lib/models/registration.model"
import { auth } from "@clerk/nextjs/server"

// --- User Actions ---

type ClerkUserPayload = {
    clerkId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
    phone?: string | null;
}

type SyncOptions = {
    trackLogin?: boolean;
    lastLoginAt?: Date;
}

export async function createUser(user: ClerkUserPayload, options: SyncOptions = {}) {
    if (!user?.clerkId || !user?.email) {
        throw new Error("Missing clerkId or email when syncing user");
    }

    await connectToDatabase();

    const now = new Date();
    const setPayload: Record<string, unknown> = {
        email: user.email.toLowerCase(),
        updatedAt: now
    };

    if (user.firstName !== undefined) setPayload.firstName = user.firstName ?? null;
    if (user.lastName !== undefined) setPayload.lastName = user.lastName ?? null;
    if (user.imageUrl !== undefined) setPayload.imageUrl = user.imageUrl ?? null;
    if (user.phone !== undefined) setPayload.phone = user.phone ?? null;

    if (options.trackLogin) {
        setPayload.lastLogin = options.lastLoginAt ?? now;
    }

    const incPayload: Record<string, number> = {};
    if (options.trackLogin) {
        incPayload.loginCount = 1;
    }

    const update: Record<string, unknown> = {
        $set: setPayload,
        $setOnInsert: {
            createdAt: now,
            isActive: true,
            loginCount: options.trackLogin ? 1 : 0
        }
    };

    if (Object.keys(incPayload).length > 0) {
        update.$inc = incPayload;
    }

    const syncedUser = await User.findOneAndUpdate(
        { clerkId: user.clerkId },
        update,
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return JSON.parse(JSON.stringify(syncedUser));
}

export async function getUserById(clerkId: string) {
    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    return JSON.parse(JSON.stringify(user));
}

export async function getRegistrationStatus(eventId: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    await connectToDatabase();
    const registration = await Registration.findOne({ userId: clerkId, eventId });

    return registration ? { status: registration.status } : null;
}
