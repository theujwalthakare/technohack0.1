"use server"

import { revalidatePath } from "next/cache"
import { updateCurrentUserProfile } from "@/lib/actions/user.actions"

export type ParticipantProfileFormState = {
    status: "idle" | "success" | "error"
    message?: string
}

function normalizeField(value: FormDataEntryValue | null) {
    if (value === null) return undefined
    if (typeof value !== "string") return undefined
    const trimmed = value.trim()
    return trimmed.length ? trimmed : null
}

export async function updateParticipantProfileAction(
    formData: FormData
): Promise<ParticipantProfileFormState> {
    const payload = {
        firstName: normalizeField(formData.get("firstName")),
        lastName: normalizeField(formData.get("lastName")),
        imageUrl: normalizeField(formData.get("imageUrl")),
        phone: normalizeField(formData.get("phone")),
        college: normalizeField(formData.get("college")),
        course: normalizeField(formData.get("course")),
        year: normalizeField(formData.get("year")),
        addressLine1: normalizeField(formData.get("addressLine1")),
        addressLine2: normalizeField(formData.get("addressLine2")),
        city: normalizeField(formData.get("city")),
        state: normalizeField(formData.get("state")),
        postalCode: normalizeField(formData.get("postalCode")),
        country: normalizeField(formData.get("country")),
        bio: normalizeField(formData.get("bio"))
    }

    try {
        await updateCurrentUserProfile(payload)
        revalidatePath("/profile")
        revalidatePath("/dashboard")
        return {
            status: "success",
            message: "Profile updated successfully."
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update profile."
        return {
            status: "error",
            message
        }
    }
}
