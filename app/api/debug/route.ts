import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/lib/models/event.model";
import { User } from "@/lib/models/user.model";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
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
    } catch (error: any) {
        return NextResponse.json({
            status: "Error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
