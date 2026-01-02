import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/events(.*)',
    '/schedule(.*)',
    '/about(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/webhooks(.*)',
    '/api/seed',
    '/api/debug'
]);

const isAdminRoute = createRouteMatcher([
    '/admin(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
    // Protect admin routes
    if (isAdminRoute(request)) {
        await auth.protect();

        // Additional admin check will be done in the admin layout
        // This just ensures user is authenticated
        return NextResponse.next();
    }

    // Protect non-public routes
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
