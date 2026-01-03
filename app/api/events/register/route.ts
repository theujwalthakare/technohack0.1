import { NextResponse } from "next/server";
import { registerCurrentUserForEvent } from "@/lib/actions/registration.actions";

export async function POST(request: Request) {
    try {
        const { eventId, teamName, teamMembers } = await request.json();

        if (!eventId || typeof eventId !== "string") {
            return NextResponse.json({ success: false, message: "Invalid eventId" }, { status: 400 });
        }

        const result = await registerCurrentUserForEvent({ eventId, teamName, teamMembers });
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error: unknown) {
        console.error("Registration API error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
