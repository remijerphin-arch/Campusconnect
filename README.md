# CampusConnect

CampusConnect is a cloud-based integrated student platform that brings academics, attendance, placement support, lost-and-found updates, and peer resource exchange into one digital ecosystem.

## What it covers

- Academic information in one place
- RFID-backed attendance sync into the cloud platform
- Placement discovery and eligibility tracking
- Lost-and-found and student resource exchange highlights
- Role-based dashboards for students, faculty, and placement admins
- Supabase-ready authentication with a demo-mode fallback for local previews

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase publishable key and any other browser-safe public keys.
3. Create the matching users and role metadata in Supabase Auth.

The app reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the environment. Never put the database connection string, service role key, or any password in client code or Git. The direct database connection also requires replacing `[YOUR-PASSWORD]` with the database password and should only be used from a secure server or migration tool.

The current screens use local mock data so the UI remains available while the Supabase schema and row-level security policies are being created. The first cloud-backed flow is email/password authentication; academic, attendance, placement, lost-and-found, and resource records can be moved behind Supabase tables next.

For the Supabase CLI workflow:

```bash
supabase login
supabase init
supabase link --project-ref tviinfhlaihmapxuklvn
```

## Included product features

- Role-aware student, faculty, and placement-admin navigation
- Academic trend, attendance, applications, and deadline summaries
- Faculty attendance and marks entry surfaces
- Placement discovery, eligibility, and candidate lifecycle views
- Community highlights for lost-and-found and resource exchange
- Responsive sidebar, mobile navigation, notifications, and RFID sync status indicator

## Run locally

```bash
npm install
npm run dev
```
