import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserRegistrations, getUserStats } from "@/lib/actions/registration.actions";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [stats, registrations] = await Promise.all([
            getUserStats(userId),
            getUserRegistrations(userId)
        ]);

        return NextResponse.json({ stats, registrations });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to load registrations";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
