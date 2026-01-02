import { Schema, model, models } from "mongoose";

const RegistrationSchema = new Schema({
    userId: { type: String, required: true }, // Clerk user ID
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },

    // User Info (cached for quick access)
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },

    // Team Info (for team events)
    teamName: { type: String },
    teamMembers: [{
        name: String,
        email: String,
        phone: String
    }],

    // Registration Details
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "waitlist"],
        default: "confirmed"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    transactionId: { type: String },

    // Metadata
    registeredAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// TypeScript Interface
export interface Registration {
    _id: string;
    userId: string;
    eventId: string;
    userName: string;
    userEmail: string;
    teamName?: string;
    teamMembers?: Array<{
        name: string;
        email: string;
        phone: string;
    }>;
    status: "pending" | "confirmed" | "cancelled" | "waitlist";
    paymentStatus: "pending" | "completed" | "failed";
    transactionId?: string;
    registeredAt: Date;
    updatedAt: Date;
}

const Registration = models.Registration || model("Registration", RegistrationSchema);

export default Registration;
