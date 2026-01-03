import { NextResponse } from "next/server";
import { registerCurrentUserForEvent } from "@/lib/actions/registration.actions";

const ALLOWED_PAYMENT_MODES = ["upi", "cash"] as const;
const MAX_PROOF_CHARS = 8_000_000; // ~6 MB when base64 encoded

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            eventId,
            teamName,
            teamMembers,
            paymentMode,
            transactionReference,
            paymentProof
        } = body ?? {};

        if (!eventId || typeof eventId !== "string") {
            return NextResponse.json({ success: false, message: "Invalid eventId" }, { status: 400 });
        }

        if (!ALLOWED_PAYMENT_MODES.includes(paymentMode)) {
            return NextResponse.json({ success: false, message: "Invalid payment mode" }, { status: 400 });
        }

        const reference = typeof transactionReference === "string" ? transactionReference.trim() : "";
        const requiresReference = paymentMode === "upi";
        if (requiresReference && !reference) {
            return NextResponse.json({ success: false, message: "Transaction reference is required" }, { status: 400 });
        }

        let proofPayload: string | undefined;
        if (typeof paymentProof === "string" && paymentProof.length > 0) {
            if (paymentProof.length > MAX_PROOF_CHARS) {
                return NextResponse.json({ success: false, message: "Payment proof is too large" }, { status: 400 });
            }
            proofPayload = paymentProof;
        }

        const normalizedTeamMembers = Array.isArray(teamMembers) ? teamMembers : undefined;

        const result = await registerCurrentUserForEvent({
            eventId,
            teamName,
            teamMembers: normalizedTeamMembers,
            paymentMode,
            transactionReference: requiresReference ? reference : undefined,
            paymentProof: proofPayload
        });
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error: unknown) {
        console.error("Registration API error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
