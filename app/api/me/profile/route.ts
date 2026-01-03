import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getUserById } from "@/lib/actions/user.actions"

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const user = await getUserById(userId)
        const role = (user?.role as string | undefined) ?? "user"
        const isAdmin = role === "admin" || role === "superadmin"

        return NextResponse.json({
            role,
            isAdmin,
            firstName: user?.firstName ?? null,
            lastName: user?.lastName ?? null,
            email: user?.email ?? null
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to load profile"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
