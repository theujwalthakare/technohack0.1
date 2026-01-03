import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'
import { createUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Do something with the payload
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const payload = transformClerkPayload(evt.data);
        await createUser(payload);
    }

    if (eventType === 'session.created') {
        const userId = evt.data.user_id;
        if (userId) {
            const clerkUser = await clerkClient.users.getUser(userId);
            const payload = transformClerkPayload(clerkUser);
            const lastActive = timestampToDate(evt.data.last_active_at) ?? new Date();
            await createUser(payload, { trackLogin: true, lastLoginAt: lastActive });
        }
    }

    return NextResponse.json({ message: 'OK', user: id, eventType });
}

type ClerkUserLike = {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    emailAddresses?: Array<{ emailAddress: string }>;
    first_name?: string | null;
    firstName?: string | null;
    last_name?: string | null;
    lastName?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
    phone_numbers?: Array<{ phone_number: string }>;
    phoneNumbers?: Array<{ phoneNumber: string }>;
};

function transformClerkPayload(data: ClerkUserLike) {
    const email = data?.email_addresses?.[0]?.email_address
        ?? data?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
        throw new Error('Unable to determine primary email for Clerk user');
    }

    return {
        clerkId: data.id,
        email,
        firstName: data.first_name ?? data.firstName ?? null,
        lastName: data.last_name ?? data.lastName ?? null,
        imageUrl: data.image_url ?? data.imageUrl ?? null,
        phone: data.phone_numbers?.[0]?.phone_number ?? data.phoneNumbers?.[0]?.phoneNumber ?? null
    };
}

function timestampToDate(input?: number | null) {
    if (!input) return undefined;
    // Clerk timestamps are in seconds
    return new Date(input * 1000);
}
