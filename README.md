# CampusConnect

CampusConnect is a cloud-based integrated student platform that brings academics, attendance, placement support, lost-and-found updates, and peer resource exchange into one digital ecosystem.

## What it covers

- Academic information in one place
- RFID-backed attendance sync into the cloud platform
- Placement discovery and eligibility tracking
- Lost-and-found and student resource exchange highlights
- Role-based dashboards for students, faculty, placement admins, and campus admins
- Supabase-ready authentication with a demo-mode fallback for local previews
- Campus admin control center for access, services, integrations, and audit activity
- Faculty editing for attendance and internal marks with student dashboard updates
- Placement company management with add, edit, delete, and opening-count controls

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase publishable key and any other browser-safe public keys.
3. Create the matching users and role metadata in Supabase Auth.

The app reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the environment. Never put the database connection string, service role key, or any password in client code or Git. The direct database connection also requires replacing `[YOUR-PASSWORD]` with the database password and should only be used from a secure server or migration tool.

The current screens use local mock data and browser storage so the UI remains available while the Supabase schema and row-level security policies are being created. Email/password authentication is connected to Supabase when configured; demo accounts and CRUD previews remain available for local development.

For the Supabase CLI workflow:

```bash
supabase login
supabase init
supabase link --project-ref tviinfhlaihmapxuklvn
```

## Included product features

- Role-aware student, faculty, placement-admin, and campus-admin navigation
- Academic trend, attendance, applications, and deadline summaries
- Faculty attendance and marks entry with saved updates visible to students
- Placement discovery, eligibility, candidate lifecycle, and company management views
- Campus-admin user access, role editing, service toggles, RFID control, maintenance mode, and audit feed
- Community highlights for lost-and-found and resource exchange
- Responsive sidebar, mobile navigation, notifications, logout, and RFID sync status indicator

## Demo accounts

Use these accounts on the local login screen:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@campusconnect.edu` | `student123` |
| Faculty | `faculty@campusconnect.edu` | `faculty123` |
| Placement Admin | `placement@campusconnect.edu` | `placement123` |
| Campus Admin | `admin@campusconnect.edu` | `admin123` |

## Test the main workflows

1. Sign in as Faculty and edit attendance or internal marks, then save.
2. Sign in as Student to see the latest faculty update summary.
3. Sign in as Placement Admin to add, edit, or delete partner companies.
4. Sign in as Campus Admin to manage access, roles, service availability, RFID sync, and maintenance mode.

Demo CRUD changes are stored in the browser's local storage. Production persistence should use Supabase tables protected by row-level security policies.

## Run locally

```bash
npm install
npm run dev
```
