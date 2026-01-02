import { Schema, model, models } from "mongoose";

// --- User Schema ---
const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },

    // Profile Details
    college: { type: String },
    phone: { type: String },
    course: { type: String },
    year: { type: String },

    createdAt: { type: Date, default: Date.now }
});

const User = models.User || model("User", UserSchema);

// --- Registration Schema ---
const RegistrationSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clerkId: { type: String, required: true },

    eventTitle: { type: String }, // Denormalized for simpler UI
    eventImage: { type: String }, // Denormalized

    status: { type: String, enum: ['REGISTERED', 'CANCELLED', 'ATTENDED'], default: 'REGISTERED' },
    teamMembers: [{ type: String }],

    registeredAt: { type: Date, default: Date.now }
});

// Prevent duplicate
RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Registration = models.Registration || model("Registration", RegistrationSchema);

export { User, Registration };
