"use server"

import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user.model"
import Event from "@/lib/models/event.model"
import Registration from "@/lib/models/registration.model"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ensureAdminRole } from "@/lib/utils/admin"

export type EventAnalytics = {
    eventId: string;
    title: string;
    category: string;
    registrations: number;
    revenue: number;
}

export type CategoryDistributionItem = {
    category: string;
    count: number;
}

export type DailyRegistrationPoint = {
    date: string;
    count: number;
}

export type AnalyticsOverview = {
    totalRevenue: number;
    totalRegistrations: number;
    avgRegistrationsPerEvent: number;
    activeEvents: number;
}

export type AdminAnalyticsPayload = {
    overview: AnalyticsOverview;
    topEvents: EventAnalytics[];
    categoryDistribution: CategoryDistributionItem[];
    dailyRegistrations: DailyRegistrationPoint[];
}

export type AdminUserRecord = {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "superadmin";
    college?: string;
    phone?: string;
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
    isBanned: boolean;
    registrationCount: number;
}

export type AdminUserStats = {
    totalUsers: number;
    adminUsers: number;
    activeUsers: number;
    bannedUsers: number;
}

export type AdminUserDirectoryPayload = {
    stats: AdminUserStats;
    users: AdminUserRecord[];
}

export type AdminRegistrationEntry = {
    id: string;
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    eventSlug?: string;
    userName: string;
    userEmail: string;
    status: string;
    paymentStatus: string;
    registeredAt: string;
    eventDate?: string;
    venue?: string;
    teamName?: string;
    teamSize: number;
    amount: number;
}

export type AdminRegistrationStats = {
    totalRegistrations: number;
    confirmed: number;
    pending: number;
    waitlist: number;
    cancelled: number;
    paid: number;
    pendingPayments: number;
    failedPayments: number;
    projectedRevenue: number;
}

export type AdminRegistrationsPayload = {
    stats: AdminRegistrationStats;
    registrations: AdminRegistrationEntry[];
}

// Security check helper
async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const result = await ensureAdminRole();
    if (!result.success) {
        redirect("/unauthorized");
    }
}

function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
    let candidate = base;
    let suffix = 2;

    while (true) {
        const existing = await Event.findOne({ slug: candidate }, { _id: 1 }).lean();
        if (!existing) return candidate;
        if (excludeId && existing._id?.toString() === excludeId) return candidate;
        candidate = `${base}-${suffix}`;
        suffix += 1;
    }
}

function getRequiredString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (!value) {
        throw new Error(`${key} is required`);
    }
    return value.toString().trim();
}

function getOptionalString(formData: FormData, key: string) {
    const value = formData.get(key);
    if (!value) return undefined;
    const parsed = value.toString().trim();
    return parsed.length ? parsed : undefined;
}

function getNumber(formData: FormData, key: string, fallback = 0) {
    const value = formData.get(key);
    if (!value) return fallback;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        throw new Error(`${key} must be a number`);
    }
    return parsed;
}

function getBoolean(formData: FormData, key: string, fallback = false) {
    const value = formData.get(key);
    if (value === null) return fallback;
    const normalized = value.toString().toLowerCase();
    return normalized === "true" || normalized === "on" || normalized === "1";
}

export async function getAdminStats() {
    await checkAdmin();
    await connectToDatabase();

    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const registrations = await Registration.countDocuments();

    const recentRegistrations = await Registration.find({})
        .sort({ registeredAt: -1 })
        .limit(5)
        .lean();

    return {
        users,
        events,
        registrations,
        recentRegistrations: JSON.parse(JSON.stringify(recentRegistrations))
    };
}

export async function getAllEventsAdmin() {
    await checkAdmin();
    await connectToDatabase();

    const events = await Event.find({}).sort({ dateTime: 1 }).lean();

    // Attach registration count to each event
    const eventsWithCounts = await Promise.all(events.map(async (event) => {
        const count = await Registration.countDocuments({ eventId: event._id });
        return {
            ...event,
            _id: event._id.toString(),
            registrationCount: count
        };
    }));

    return eventsWithCounts;
}

export async function getAdminEventById(eventId: string) {
    await checkAdmin();
    await connectToDatabase();

    const event = await Event.findById(eventId).lean();
    if (!event) return null;
    return {
        ...event,
        _id: event._id.toString(),
        dateTime: event.dateTime ? new Date(event.dateTime).toISOString() : undefined
    };
}

export async function getAdminUserDirectory(): Promise<AdminUserDirectoryPayload> {
    await checkAdmin();
    await connectToDatabase();

    const [users, registrationCounts] = await Promise.all([
        User.find({}).sort({ createdAt: -1 }).lean(),
        Registration.aggregate<{ _id: string; registrations: number }>([
            {
                $group: {
                    _id: "$userId",
                    registrations: { $sum: 1 }
                }
            }
        ])
    ]);

    const countMap = new Map<string, number>();
    registrationCounts.forEach((bucket) => {
        if (typeof bucket._id === "string") {
            countMap.set(bucket._id, bucket.registrations);
        }
    });

    const directoryUsers: AdminUserRecord[] = users.map((userDoc) => {
        const fullName = `${userDoc.firstName ?? ""} ${userDoc.lastName ?? ""}`.trim();
        return {
            id: userDoc._id.toString(),
            name: fullName || userDoc.email,
            email: userDoc.email,
            role: userDoc.role ?? "user",
            college: userDoc.college,
            phone: userDoc.phone,
            createdAt: userDoc.createdAt ? new Date(userDoc.createdAt).toISOString() : new Date().toISOString(),
            lastLogin: userDoc.lastLogin ? new Date(userDoc.lastLogin).toISOString() : undefined,
            isActive: userDoc.isActive ?? true,
            isBanned: userDoc.isBanned ?? false,
            registrationCount: countMap.get(userDoc.clerkId) ?? 0
        };
    });

    const stats: AdminUserStats = {
        totalUsers: directoryUsers.length,
        adminUsers: directoryUsers.filter((user) => user.role !== "user").length,
        activeUsers: directoryUsers.filter((user) => user.isActive && !user.isBanned).length,
        bannedUsers: directoryUsers.filter((user) => user.isBanned).length
    };

    return {
        stats,
        users: directoryUsers
    };
}

export async function getAdminRegistrations(limit = 150): Promise<AdminRegistrationsPayload> {
    await checkAdmin();
    await connectToDatabase();

    const [statusAgg, paymentAgg, revenueAgg, registrations] = await Promise.all([
        Registration.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    waitlist: { $sum: { $cond: [{ $eq: ["$status", "waitlist"] }, 1, 0] } },
                    cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } }
                }
            }
        ]),
        Registration.aggregate([
            {
                $group: {
                    _id: null,
                    paid: { $sum: { $cond: [{ $eq: ["$paymentStatus", "completed"] }, 1, 0] } },
                    pendingPayments: { $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] } },
                    failedPayments: { $sum: { $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0] } }
                }
            }
        ]),
        Registration.aggregate([
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "event"
                }
            },
            { $unwind: "$event" },
            {
                $group: {
                    _id: null,
                    projectedRevenue: { $sum: "$event.price" }
                }
            }
        ]),
        Registration.find({})
            .sort({ registeredAt: -1 })
            .limit(limit)
            .populate("eventId", "title category dateTime venue price slug")
            .lean()
    ]);

    const statusStats = statusAgg[0] ?? {};
    const paymentStats = paymentAgg[0] ?? {};
    const projectedRevenue = revenueAgg[0]?.projectedRevenue ?? 0;

    const stats: AdminRegistrationStats = {
        totalRegistrations: statusStats.total ?? 0,
        confirmed: statusStats.confirmed ?? 0,
        pending: statusStats.pending ?? 0,
        waitlist: statusStats.waitlist ?? 0,
        cancelled: statusStats.cancelled ?? 0,
        paid: paymentStats.paid ?? 0,
        pendingPayments: paymentStats.pendingPayments ?? 0,
        failedPayments: paymentStats.failedPayments ?? 0,
        projectedRevenue
    };

    const normalizedRegistrations: AdminRegistrationEntry[] = registrations.map((reg) => {
        const eventDoc = reg.eventId as unknown as {
            _id?: { toString(): string };
            title?: string;
            category?: string;
            dateTime?: Date | string;
            venue?: string;
            price?: number;
            slug?: string;
        } | null;

        return {
            id: reg._id.toString(),
            eventId: eventDoc?._id ? eventDoc._id.toString() : "",
            eventTitle: eventDoc?.title ?? "Unknown Event",
            eventCategory: eventDoc?.category ?? "General",
            eventSlug: eventDoc?.slug,
            userName: reg.userName,
            userEmail: reg.userEmail,
            status: reg.status,
            paymentStatus: reg.paymentStatus,
            registeredAt: reg.registeredAt ? new Date(reg.registeredAt).toISOString() : new Date().toISOString(),
            eventDate: eventDoc?.dateTime ? new Date(eventDoc.dateTime).toISOString() : undefined,
            venue: eventDoc?.venue,
            teamName: reg.teamName ?? undefined,
            teamSize: Array.isArray(reg.teamMembers) ? reg.teamMembers.length : 0,
            amount: typeof eventDoc?.price === "number" ? eventDoc.price : 0
        };
    });

    return {
        stats,
        registrations: normalizedRegistrations
    };
}

export async function createAdminEvent(formData: FormData) {
    await checkAdmin();
    await connectToDatabase();

    const title = getRequiredString(formData, "title");
    const slugInput = getOptionalString(formData, "slug");
    const slugBase = slugInput ? toSlug(slugInput) : toSlug(title);
    if (!slugBase) {
        throw new Error("Slug is required");
    }

    const slug = await ensureUniqueSlug(slugBase);

    const dateTimeInput = getRequiredString(formData, "dateTime");
    const dateTime = new Date(dateTimeInput);
    if (Number.isNaN(dateTime.getTime())) {
        throw new Error("Invalid date & time");
    }

    const newEvent = {
        title,
        slug,
        description: getRequiredString(formData, "description"),
        image: getRequiredString(formData, "image"),
        category: getRequiredString(formData, "category"),
        dateTime,
        venue: getRequiredString(formData, "venue"),
        price: getNumber(formData, "price", 0),
        teamSize: getNumber(formData, "teamSize", 1),
        mode: getRequiredString(formData, "mode"),
        firstPrize: getNumber(formData, "firstPrize", 0),
        secondPrize: getNumber(formData, "secondPrize", 0),
        certificates: getBoolean(formData, "certificates", true),
        coordinatorName: getRequiredString(formData, "coordinatorName"),
        coordinatorPhone: getRequiredString(formData, "coordinatorPhone"),
        whatsappLink: getOptionalString(formData, "whatsappLink"),
        rules: getOptionalString(formData, "rules"),
        isPublished: getBoolean(formData, "isPublished", false)
    };

    await Event.create(newEvent);
    revalidatePath("/admin/events");
    revalidatePath("/admin/analytics");
    revalidatePath("/events");
    revalidatePath("/");
    redirect("/admin/events?status=created");
}

export async function updateAdminEvent(formData: FormData) {
    await checkAdmin();
    await connectToDatabase();

    const eventId = formData.get("eventId")?.toString();
    if (!eventId) {
        throw new Error("Missing event id");
    }

    const existing = await Event.findById(eventId);
    if (!existing) {
        throw new Error("Event not found");
    }

    const title = getOptionalString(formData, "title") ?? existing.title;
    const slugInput = getOptionalString(formData, "slug") ?? existing.slug;
    const slugBase = slugInput ? toSlug(slugInput) : toSlug(title);
    if (!slugBase) {
        throw new Error("Slug is required");
    }
    const slug = await ensureUniqueSlug(slugBase, eventId);

    const dateTimeInput = getOptionalString(formData, "dateTime");
    const dateTime = dateTimeInput ? new Date(dateTimeInput) : existing.dateTime;
    if (!dateTime || Number.isNaN(new Date(dateTime).getTime())) {
        throw new Error("Invalid date & time");
    }

    const updatedEvent = {
        title,
        slug,
        description: getOptionalString(formData, "description") ?? existing.description,
        image: getOptionalString(formData, "image") ?? existing.image,
        category: getOptionalString(formData, "category") ?? existing.category,
        dateTime,
        venue: getOptionalString(formData, "venue") ?? existing.venue,
        price: getNumber(formData, "price", existing.price ?? 0),
        teamSize: getNumber(formData, "teamSize", existing.teamSize ?? 1),
        mode: getOptionalString(formData, "mode") ?? existing.mode,
        firstPrize: getNumber(formData, "firstPrize", existing.firstPrize ?? 0),
        secondPrize: getNumber(formData, "secondPrize", existing.secondPrize ?? 0),
        certificates: getBoolean(formData, "certificates", existing.certificates ?? true),
        coordinatorName: getOptionalString(formData, "coordinatorName") ?? existing.coordinatorName,
        coordinatorPhone: getOptionalString(formData, "coordinatorPhone") ?? existing.coordinatorPhone,
        whatsappLink: getOptionalString(formData, "whatsappLink") ?? existing.whatsappLink,
        rules: getOptionalString(formData, "rules") ?? existing.rules,
        isPublished: getBoolean(formData, "isPublished", existing.isPublished ?? false)
    };

    await Event.findByIdAndUpdate(eventId, updatedEvent);
    revalidatePath("/admin/events");
    revalidatePath("/admin/analytics");
    revalidatePath("/events");
    revalidatePath("/");
    redirect(`/admin/events/${eventId}?status=updated`);
}

export async function deleteAdminEvent(formData: FormData) {
    await checkAdmin();
    await connectToDatabase();

    const eventId = formData.get("eventId")?.toString();
    if (!eventId) {
        throw new Error("Missing event id");
    }

    await Registration.deleteMany({ eventId });
    await Event.findByIdAndDelete(eventId);

    revalidatePath("/admin/events");
    revalidatePath("/admin/analytics");
    revalidatePath("/events");
    revalidatePath("/");
    redirect("/admin/events?status=deleted");
}

export async function toggleEventStatus(eventId: string, currentStatus: boolean) {
    await checkAdmin();
    await connectToDatabase();

    await Event.findByIdAndUpdate(eventId, { isPublished: !currentStatus });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    redirect("/admin/events?status=toggled");
}

export async function getEventRegistrations(eventId: string) {
    await checkAdmin();
    await connectToDatabase();

    const registrations = await Registration.find({ eventId })
        .populate('userId', 'firstName lastName email college phone') // Populate User details
        .lean();

    return JSON.parse(JSON.stringify(registrations));
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsPayload> {
    await checkAdmin();
    await connectToDatabase();

    const perEvent = await Registration.aggregate<EventAnalytics>([
        {
            $lookup: {
                from: "events",
                localField: "eventId",
                foreignField: "_id",
                as: "event"
            }
        },
        { $unwind: "$event" },
        {
            $group: {
                _id: "$event._id",
                title: { $first: "$event.title" },
                category: { $first: "$event.category" },
                registrations: { $sum: 1 },
                revenue: { $sum: "$event.price" }
            }
        },
        {
            $project: {
                _id: 0,
                eventId: { $toString: "$_id" },
                title: 1,
                category: 1,
                registrations: 1,
                revenue: 1
            }
        },
        { $sort: { registrations: -1 } }
    ]);

    const categoryDistribution = await Registration.aggregate<CategoryDistributionItem>([
        {
            $lookup: {
                from: "events",
                localField: "eventId",
                foreignField: "_id",
                as: "event"
            }
        },
        { $unwind: "$event" },
        {
            $group: {
                _id: "$event.category",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1
            }
        },
        { $sort: { count: -1 } }
    ]);

    const dailyRegistrations = await Registration.aggregate<DailyRegistrationPoint>([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$registeredAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1
            }
        },
        { $sort: { date: 1 } }
    ]);

    const totalRegistrations = perEvent.reduce((sum, item) => sum + item.registrations, 0);
    const totalRevenue = perEvent.reduce((sum, item) => sum + item.revenue, 0);
    const avgRegistrationsPerEvent = perEvent.length ? totalRegistrations / perEvent.length : 0;

    const overview: AnalyticsOverview = {
        totalRevenue,
        totalRegistrations,
        avgRegistrationsPerEvent,
        activeEvents: perEvent.length
    };

    return {
        overview,
        topEvents: perEvent.slice(0, 5),
        categoryDistribution,
        dailyRegistrations
    };
}
