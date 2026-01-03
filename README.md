## TechnoHack 2026 Web Portal

Next.js 16 App Router project that powers the TechnoHack festival site, including public marketing pages, attendee dashboards, event registrations, and a Clerk-protected admin panel backed by MongoDB.

### Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Clerk for authentication + middleware route protection
- MongoDB Atlas via Mongoose models (events, registrations, users, audit logs)
- Tailwind CSS v4 utility classes + Framer Motion micro-interactions
- Resend (optional) for transactional email

---

## Prerequisites

- Node.js 18+ (18.18.0 or 20.11+ recommended by Next.js 16)
- pnpm/yarn/npm (examples below use `npm`)
- MongoDB connection string (Atlas or self-hosted)
- Clerk application with OAuth redirect URLs configured for `http://localhost:3000`

---

## Environment Variables

Create `web/.env.local` (never commit it) and provide:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key used on the client |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side APIs |
| `CLERK_WEBHOOK_SECRET` | Svix signing secret for `/api/webhooks/clerk` |
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_EMAILS` | Comma-separated list of admin emails auto-promoted on login |
| `SUPERADMIN_EMAIL` | Single email with elevated access (audit/system pages) |
| `RESEND_API_KEY` | Optional: enable transactional confirmation emails |

> For local testing, set `ADMIN_EMAILS` to your Clerk email so you can access `/admin` and hit protected endpoints like `/api/seed`.

---

## Setup & Development

```bash
cd web
npm install

# start the dev server
npm run dev
```

Visit `http://localhost:3000` and sign in via Clerk. The middleware only allows authenticated users outside the marketing pages, and admin routes require your email to be whitelisted or promoted from the database.

### Creating an Admin Account

1. Ensure your email is present in `ADMIN_EMAILS` **or** run the helper script after you have at least one user record:

	```bash
	npx tsx scripts/seed-admin.ts you@example.com
	```

2. The script connects with `MONGODB_URI`, finds the user by email, and upgrades their `role` to `admin`.

### Seeding Event Data

With an authenticated admin session you can hit the protected endpoint:

```bash
curl -H "Authorization: Bearer <Clerk session cookie>" http://localhost:3000/api/seed
```

or temporarily add your email to `ADMIN_EMAILS` and open `http://localhost:3000/api/seed` in the browser. The route wipes and re-inserts the curated TechnoHack event lineup, so do **not** expose it publicly.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Launch Next.js with hot reload |
| `npm run lint` | Run ESLint (Next.js config) |
| `npm run build` | Production build (runs type check + lint) |
| `npm run start` | Start production server (after `build`) |

---

## Deployment Checklist

1. Provision MongoDB Atlas and store the URI in the platform secret manager.
2. Configure Clerk production keys and redirect URLs; update `.env` equivalents (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
3. Set `CLERK_WEBHOOK_SECRET` if you rely on the Svix webhook to persist users.
4. Populate `ADMIN_EMAILS`/`SUPERADMIN_EMAIL` with the real staff list.
5. Provide `RESEND_API_KEY` if you plan to send transactional emails from `/lib/email`.
6. Deploy via Vercel or a Node host (`npm run build && npm run start`). Ensure the middleware matcher is compatible with your platform’s edge/runtime limits.

---

## Troubleshooting

- **Unauthorized on `/admin`**: confirm your email is in `ADMIN_EMAILS` or that the `User` document has `role: "admin"`. The layout uses `ensureAdminRole()` to auto-promote whitelisted users.
- **`MONGODB_URI` error**: the server throws early if the variable is missing. Double-check `.env.local` and any deployment secrets.
- **Registration issues**: see `/app/api/events/register/route.ts`. The endpoint requires an authenticated Clerk session and returns JSON `{ success, message }` for client components.

Feel free to extend this README with additional operational notes (CI, monitoring, etc.) as the project matures.
