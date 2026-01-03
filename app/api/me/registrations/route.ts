import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserRegistrations, getUserStats } from "@/lib/actions/registration.actions";
import { getUserById } from "@/lib/actions/user.actions";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [stats, registrations, userRecord] = await Promise.all([
            getUserStats(userId),
            getUserRegistrations(userId),
            getUserById(userId)
        ]);

        const role = (userRecord?.role as string | undefined) ?? "user";
        const isAdmin = role === "admin" || role === "superadmin";

        return NextResponse.json({ stats, registrations, role, isAdmin });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to load registrations";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
