import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/lib/models/event.model";
import { User } from "@/lib/models/user.model";
import { ensureAdminRole } from "@/lib/utils/admin";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const adminCheck = await ensureAdminRole();
        if (!adminCheck.success) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectToDatabase();

        // Seed if empty (just to be sure we have data to show)
        const eventCount = await Event.countDocuments();
        let events: Array<{ title: string; slug: string; }> = []; // Explicitly type events

        if (eventCount === 0) {
            // Run seed logic inline if needed, or just report 0
        } else {
            events = await Event.find({}).select("title slug").lean();
        }

        const userCount = await User.countDocuments();

        return NextResponse.json({
            status: "Connected",
            database: "MongoDB Atlas",
            counts: {
                events: eventCount,
                users: userCount
            },
            events: events
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const stack = error instanceof Error ? error.stack : undefined;
        return NextResponse.json({
            status: "Error",
            message,
            stack
        }, { status: 500 });
    }
}
