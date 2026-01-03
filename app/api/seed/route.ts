import { NextResponse } from "next/server";
import { seedEvents } from "@/lib/actions/event.actions";
import { ensureAdminRole } from "@/lib/utils/admin";

export async function GET() {
    try {
        const adminCheck = await ensureAdminRole();
        if (!adminCheck.success) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const result = await seedEvents();
        return NextResponse.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to seed events";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
