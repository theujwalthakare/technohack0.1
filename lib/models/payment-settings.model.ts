import { Schema, model, models } from "mongoose"

const PaymentSettingsSchema = new Schema({
    upiId: { type: String, required: true, default: "technohack@upi" },
    receiverName: { type: String, required: true, default: "TechnoHack Team" },
    qrImageUrl: { type: String },
    instructions: { type: String, default: "Send the registration fee via UPI and attach proof so admins can verify your payment." },
    updatedAt: { type: Date, default: Date.now }
})

PaymentSettingsSchema.pre("save", function setUpdated() {
    this.updatedAt = new Date()
})

export interface PaymentSettingsDocument {
    _id: string
    upiId: string
    receiverName: string
    qrImageUrl?: string
    instructions?: string
    updatedAt: Date
}

const PaymentSettings = models.PaymentSettings || model("PaymentSettings", PaymentSettingsSchema)

export default PaymentSettings
