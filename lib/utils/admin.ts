"use server"

import { currentUser } from "@clerk/nextjs/server"
import { User } from "@/lib/models/user.model"
import { AuditLog } from "@/lib/models/audit-log.model"
import { connectToDatabase } from "@/lib/db"

// Admin email whitelist - add your admin emails here
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL?.toLowerCase()

/**
 * Check if user is admin
 */
export async function isUserAdmin(): Promise<boolean> {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return false

        const email = clerkUser.emailAddresses[0]?.emailAddress.toLowerCase()
        if (!email) return false

        // 1. Check if email is in whitelist (Environment Variable Override)
        if (ADMIN_EMAILS.includes(email) || email === SUPERADMIN_EMAIL) {
            return true
        }

        // 2. Check Database Role
        await connectToDatabase()
        const user = await User.findOne({ clerkId: clerkUser.id })

        if (!user) return false

        return user.role === 'admin' || user.role === 'superadmin'
    } catch (error) {
        console.error('Error checking admin status:', error)
        return false
    }
}

/**
 * Get current admin user
 */
export async function getCurrentAdmin() {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return null

        const email = clerkUser.emailAddresses[0]?.emailAddress.toLowerCase()
        if (!email) return null

        await connectToDatabase()
        const user = await User.findOne({ clerkId: clerkUser.id })

        // Check whitelist OR database role
        const isWhitelisted = ADMIN_EMAILS.includes(email) || email === SUPERADMIN_EMAIL
        const hasAdminRole = user && (user.role === 'admin' || user.role === 'superadmin')

        if (isWhitelisted || hasAdminRole) {
            // If whitelisted but not in DB (edge case), we might return null here or need to handle it.
            // But usually ensureAdminRole should have run.
            // Ideally we return the user object if it exists.
            return user
        }

        return null
    } catch (error) {
        console.error('Error getting current admin:', error)
        return null
    }
}

/**
 * Ensure user has admin role (auto-assign if whitelisted, otherwise check DB)
 */
export async function ensureAdminRole() {
    try {
        const clerkUser = await currentUser()
        if (!clerkUser) return { success: false, error: 'Not authenticated' }

        const email = clerkUser.emailAddresses[0]?.emailAddress.toLowerCase()
        if (!email) return { success: false, error: 'No email found' }

        await connectToDatabase()

        // Find user
        let user = await User.findOne({ clerkId: clerkUser.id })

        // Check if whitelisted
        const isSuperAdmin = email === SUPERADMIN_EMAIL
        const isWhitelisted = ADMIN_EMAILS.includes(email) || isSuperAdmin

        // If not whitelisted AND (no user OR user is not admin), deny access
        if (!isWhitelisted) {
            if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
                return { success: false, error: 'Not authorized' }
            }
        }

        // If we are here, user is EITHER whitelisted OR has admin role in DB.

        if (!user) {
            // User doesn't exist in DB - Valid ONLY if whitelisted
            // (If they weren't whitelisted, they would have been caught above)

            user = await User.create({
                clerkId: clerkUser.id,
                email: email,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                imageUrl: clerkUser.imageUrl,
                role: isSuperAdmin ? 'superadmin' : 'admin', // Auto-promote whitelisted
                lastLogin: new Date(),
                loginCount: 1
            })

            await logAdminAction({
                adminId: user._id.toString(),
                adminEmail: email,
                adminName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                action: 'LOGIN',
                resourceType: 'auth',
                metadata: { firstLogin: true, method: 'whitelist_auto_create' }
            })

        } else {
            // User exists
            let roleChanged = false

            // Enforce whitelist promotion (if they are user in DB but whitelisted in Env, promote them)
            if (isWhitelisted && user.role === 'user') {
                user.role = isSuperAdmin ? 'superadmin' : 'admin'
                roleChanged = true
            }

            // Update stats
            user.lastLogin = new Date()
            user.loginCount = (user.loginCount || 0) + 1
            await user.save()

            if (roleChanged) {
                await logAdminAction({
                    adminId: user._id.toString(),
                    adminEmail: email,
                    adminName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                    action: 'PROMOTE_USER',
                    resourceType: 'user',
                    resourceId: user._id.toString(),
                    metadata: { promotedTo: user.role, reason: 'whitelist_match' }
                })
            }

            // Log login
            await logAdminAction({
                adminId: user._id.toString(),
                adminEmail: email,
                adminName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                action: 'LOGIN',
                resourceType: 'auth'
            })
        }

        return { success: true, user }
    } catch (error) {
        console.error('Error ensuring admin role:', error)
        return { success: false, error: 'Failed to verify admin status' }
    }
}

/**
 * Log admin action
 */
export async function logAdminAction(data: {
    adminId: string
    adminEmail: string
    adminName: string
    action: string
    resourceType: string
    resourceId?: string
    resourceName?: string
    changes?: Record<string, unknown>
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
    status?: 'success' | 'failed' | 'pending'
    errorMessage?: string
}) {
    try {
        await connectToDatabase()

        await AuditLog.create({
            ...data,
            timestamp: new Date()
        })
    } catch (error) {
        console.error('Error logging admin action:', error)
    }
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
    try {
        await connectToDatabase()

        const [totalUsers, totalAdmins, totalEvents, totalRegistrations] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: { $in: ['admin', 'superadmin'] } }),
            // You'll need to import Event model
            // Event.countDocuments(),
            0, // Placeholder
            // Registration.countDocuments()
            0  // Placeholder
        ])

        return {
            totalUsers,
            totalAdmins,
            totalEvents,
            totalRegistrations
        }
    } catch (error) {
        console.error('Error getting admin stats:', error)
        return {
            totalUsers: 0,
            totalAdmins: 0,
            totalEvents: 0,
            totalRegistrations: 0
        }
    }
}
