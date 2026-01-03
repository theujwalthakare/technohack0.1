"use server"

import { connectToDatabase } from "@/lib/db"
import Registration from "@/lib/models/registration.model"
import Event from "@/lib/models/event.model"
import { Event as IEvent } from "@/lib/models/event.model"
import { auth, currentUser } from "@clerk/nextjs/server"
import { User } from "@/lib/models/user.model"

type TeamMemberInput = { name?: string; email?: string; phone?: string }
type PaymentModeInput = "upi" | "cash"

type RegisterPayload = {
    eventId: string
    teamName?: string
    teamMembers?: TeamMemberInput[]
    paymentMode: PaymentModeInput
    transactionReference?: string
    paymentProof?: string
}

const MAX_PAYMENT_PROOF_BYTES = 5 * 1024 * 1024

// Register the currently authenticated user for an event
export async function registerCurrentUserForEvent({
    eventId,
    teamName,
    teamMembers = [],
    paymentMode,
    transactionReference,
    paymentProof
}: RegisterPayload) {
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

        if (!teamName?.trim() && event.teamSize > 1) {
            return { success: false, message: "Team name is required for this event" }
        }

        if (!["upi", "cash"].includes(paymentMode)) {
            return { success: false, message: "Invalid payment mode" }
        }

        const rawPrice = typeof event.price === "number" ? event.price : Number(event.price ?? 0)
        if (!Number.isFinite(rawPrice) || rawPrice < 0) {
            return { success: false, message: "Event pricing is misconfigured. Please contact the organizers." }
        }

        const normalizedAmount = Number(rawPrice.toFixed(2))

        if (event.price > 0 && normalizedAmount <= 0) {
            return { success: false, message: "Paid events require a non-zero amount" }
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

        const maxTeamMembers = Math.max(event.teamSize - 1, 0)
        const limitedTeamMembers = sanitizedTeamMembers.slice(0, maxTeamMembers)

        let paymentProofUrl: string | undefined
        if (paymentProof) {
            if (!paymentProof.startsWith("data:image")) {
                return { success: false, message: "Payment proof must be an image" }
            }

            const [, base64Payload] = paymentProof.split(",")
            if (!base64Payload) {
                return { success: false, message: "Payment proof is invalid" }
            }

            const proofSize = Buffer.from(base64Payload, "base64").length
            if (proofSize > MAX_PAYMENT_PROOF_BYTES) {
                return { success: false, message: "Payment proof must be under 5MB" }
            }
            paymentProofUrl = paymentProof
        }

        const normalizedReference = (transactionReference ?? "").trim()
        const normalizedTeamName = event.teamSize > 1 ? teamName?.trim() : undefined

        if (paymentMode === "upi" && !normalizedReference) {
            return { success: false, message: "Transaction reference is required for UPI payments" }
        }

        let cashCode: string | undefined
        if (paymentMode === "cash") {
            cashCode = await generateUniqueCashCode()
        }

        const registration = await Registration.create({
            userId: clerkId,
            eventId: event._id,
            userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
            userEmail: user.email,
            teamName: normalizedTeamName,
            teamMembers: event.teamSize > 1 ? limitedTeamMembers : undefined,
            status: "confirmed",
            paymentStatus: "pending",
            paymentMode,
            amountPaid: normalizedAmount,
            transactionReference: paymentMode === "upi" ? normalizedReference : cashCode,
            cashCode,
            paymentProofUrl
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

async function generateUniqueCashCode(maxAttempts = 8): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const candidate = Math.floor(100000 + Math.random() * 900000).toString()
        const existing = await Registration.findOne({ cashCode: candidate }, { _id: 1 }).lean()
        if (!existing) {
            return candidate
        }
    }

    throw new Error("Unable to generate a unique cash reference code. Please try again.")
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
