"use server"

import { connectToDatabase } from "@/lib/db"
import PaymentSettings from "@/lib/models/payment-settings.model"
import { ensureAdminRole } from "@/lib/utils/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { PaymentSettingsData } from "@/lib/types/payment-settings"

const DEFAULT_SETTINGS: PaymentSettingsData = {
    upiId: "technohack@upi",
    receiverName: "TechnoHack Team",
    qrImageUrl: "",
    instructions: "Send the registration fee via UPI and attach proof so admins can verify your payment."
}

function sanitizeSettings(doc?: Partial<PaymentSettingsData> | null): PaymentSettingsData {
    if (!doc) return { ...DEFAULT_SETTINGS }
    return {
        upiId: doc.upiId?.trim() || DEFAULT_SETTINGS.upiId,
        receiverName: doc.receiverName?.trim() || DEFAULT_SETTINGS.receiverName,
        qrImageUrl: doc.qrImageUrl || "",
        instructions: doc.instructions || DEFAULT_SETTINGS.instructions
    }
}

export async function getPaymentSettings(): Promise<PaymentSettingsData> {
    await connectToDatabase()
    const existing = await PaymentSettings.findOne().lean()
    return sanitizeSettings(existing ?? undefined)
}

const MAX_QR_BYTES = 3 * 1024 * 1024

async function fileToDataUrl(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (buffer.byteLength > MAX_QR_BYTES) {
        throw new Error("QR image exceeds 3MB limit")
    }
    const mime = file.type || "image/png"
    const base64 = buffer.toString("base64")
    return `data:${mime};base64,${base64}`
}

export async function updatePaymentSettings(formData: FormData) {
    const result = await ensureAdminRole()
    if (!result.success) {
        redirect("/unauthorized")
    }

    await connectToDatabase()

    const upiId = formData.get("upiId")?.toString().trim() ?? ""
    const receiverName = formData.get("receiverName")?.toString().trim() ?? ""
    const instructions = formData.get("instructions")?.toString().trim() ?? ""
    const removeQr = formData.get("removeQr") === "true" || formData.get("removeQr") === "on"
    const currentQr = formData.get("currentQr")?.toString() ?? ""
    const qrFile = formData.get("qrImage") as File | null

    if (!upiId) {
        throw new Error("UPI ID is required")
    }

    if (!receiverName) {
        throw new Error("Receiver name is required")
    }

    let qrImageUrl = currentQr
    if (removeQr) {
        qrImageUrl = ""
    }

    if (qrFile && qrFile.size > 0) {
        qrImageUrl = await fileToDataUrl(qrFile)
    }

    await PaymentSettings.findOneAndUpdate(
        {},
        {
            upiId,
            receiverName,
            instructions,
            qrImageUrl: qrImageUrl || undefined,
            updatedAt: new Date()
        },
        { upsert: true, new: true }
    )

    revalidatePath("/events")
    revalidatePath("/admin/payment-settings")
    revalidatePath("/admin/registrations")

    redirect("/admin/payment-settings?status=updated")
}
