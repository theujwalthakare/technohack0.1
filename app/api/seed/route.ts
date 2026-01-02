import { NextResponse } from "next/server";
import { seedEvents } from "@/lib/actions/event.actions";

export async function GET() {
    try {
        const result = await seedEvents();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
