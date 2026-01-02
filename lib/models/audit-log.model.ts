import { Schema, model, models } from "mongoose";

// Audit Log Schema for tracking admin actions
const AuditLogSchema = new Schema({
    // Who performed the action
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adminEmail: { type: String, required: true },
    adminName: { type: String },

    // What action was performed
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN',
            'LOGOUT',
            'CREATE_EVENT',
            'UPDATE_EVENT',
            'DELETE_EVENT',
            'PUBLISH_EVENT',
            'UNPUBLISH_EVENT',
            'CREATE_USER',
            'UPDATE_USER',
            'DELETE_USER',
            'BAN_USER',
            'UNBAN_USER',
            'PROMOTE_USER',
            'DEMOTE_USER',
            'DELETE_REGISTRATION',
            'EXPORT_DATA',
            'SYSTEM_CONFIG'
        ],
        index: true
    },

    // What resource was affected
    resourceType: {
        type: String,
        enum: ['event', 'user', 'registration', 'system', 'auth'],
        index: true
    },
    resourceId: { type: String }, // ID of the affected resource
    resourceName: { type: String }, // Name/title for easy reference

    // Details of the change
    changes: { type: Schema.Types.Mixed }, // Before/after data
    metadata: { type: Schema.Types.Mixed }, // Additional context

    // Security tracking
    ipAddress: { type: String },
    userAgent: { type: String },

    // Status
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'success'
    },
    errorMessage: { type: String },

    timestamp: { type: Date, default: Date.now, index: true }
});

// Indexes for efficient querying
AuditLogSchema.index({ adminId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });

const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);

export { AuditLog };
