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

    // Admin & Roles
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user',
        index: true
    },
    permissions: [{ type: String }], // e.g., ['manage_events', 'manage_users']

    // Security & Tracking
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date },
    bannedReason: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Virtual for checking if user is admin
UserSchema.virtual('isAdmin').get(function () {
    return this.role === 'admin' || this.role === 'superadmin';
});

// Virtual for checking if user is superadmin
UserSchema.virtual('isSuperAdmin').get(function () {
    return this.role === 'superadmin';
});

// Update timestamp on save
UserSchema.pre('save', function () {
    this.updatedAt = new Date();
});

const User = models.User || model("User", UserSchema);

// Export just the User model
export { User };
