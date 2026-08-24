# CampusConnect

> A role-aware campus operating system for academics, student life, and career growth.

CampusConnect brings the daily college experience into one focused workspace. Students can follow their academic progress, manage campus services, discover opportunities, recover lost items, and participate in campus life. Faculty can run teaching workflows. Placement teams can manage company drives. Campus administrators control access, modules, and platform policy.

## Product Surface

| Workspace | What it includes |
| --- | --- |
| Student | Dashboard, profile, academics, attendance, timetable, assignments, exams, resources, announcements, leave, community, Lost & Found, events, clubs, exchange, help desk, placements |
| Faculty | Subjects, rosters, date-based attendance, bulk attendance, low-attendance review, marks, assessment types, assignments, leave review, exports |
| Placement Admin | Companies, drives, eligibility, lifecycle stages, applications, explainable shortlist scoring, candidate selection |
| Campus Admin | Users, roles, permissions, module switches, dashboard widgets, RFID state, maintenance mode, audit activity |

## Highlights

- Supplied CampusConnect open-book logo with responsive branding
- Role-aware navigation and protected workspace routes
- Supabase Auth with server-side role resolution and middleware session refresh
- Student academic record with marks, attendance, SGPA/CGPA, charts, and print-to-PDF reporting
- Faculty attendance editing with bulk actions, date selection, warnings, and CSV export
- Configurable assessment types including CIA, assignment, quiz, mid-sem, practical, and custom types
- Placement company CRUD, drive creation, lifecycle stages, and selection rounds
- Explainable placement screening based on CGPA, backlogs, attendance, and drive criteria
- Student profile with permitted-field editing and professional details
- Campus Services workspace for timetable, assignments, exams, resources, leave, community, events, exchange, and help desk
- First-class Lost & Found reporting, search, filters, private claim verification, and status flow
- Campus Admin customization for modules, permissions, widget visibility, and widget order
- Working global search, notification panel, unread state, mark-all-read, logout, and back navigation
- Light/dark theme with saved preference
- Responsive layouts for desktop, tablet, and mobile screens

## Routes

- `/` - Role-aware sign in and demo access
- `/student-dashboard` - Student home
- `/student-profile` - Profile and professional information
- `/academics` - Marks, attendance, results, and performance
- `/student-services` - Student service hub
- `/lost-found` - Lost & Found reports and claims
- `/faculty-dashboard` - Faculty teaching workspace
- `/placement-admin` - Placement management and smart screening
- `/campus-admin` - Campus control center

## Local Development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:4028](http://localhost:4028).

Quality checks:

```bash
npm run type-check
npm run lint
npm run build
```

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@campusconnect.edu` | `student123` |
| Faculty | `faculty@campusconnect.edu` | `faculty123` |
| Placement Admin | `placement@campusconnect.edu` | `placement123` |
| Campus Admin | `admin@campusconnect.edu` | `admin123` |

Demo changes use browser storage so the workflows remain usable without a backend session. Demo mode is for development only.

## Architecture

```text
Supabase Auth / Database / Storage
              |
     Server repository layer
              |
     RBAC and route validation
              |
     Role-specific React screens
              |
        Shared UI components
```

- `src/lib/data/repository.ts` is the server data-access boundary with an explicit demo fallback.
- `src/lib/data/dataProvider.ts` exposes the common provider contract.
- `src/lib/auth/permissions.ts` defines the centralized `module.action` permission vocabulary.
- `middleware.ts` refreshes Supabase sessions and blocks unauthorized paths.
- `src/lib/validation.ts` centralizes required fields, email, phone, date, CGPA, and marks validation.
- `src/lib/supabase/storage.ts` validates file type, size, bucket, and user-scoped paths.
- `src/lib/demoStore.ts` is intentionally limited to local demo persistence.

## Supabase Setup

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The database password, service-role key, and access tokens must remain server-only. Never commit `.env`, `.env.local`, or secrets.

The project includes migrations for profiles, roles, permissions, academic records, assignments, submissions, placement workflows, notifications, leave, events, resources, Lost & Found, community, support tickets, clubs, custom fields, settings, audit logs, and private Storage buckets.

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Review the RLS policies for your institution before production use. Supabase Storage policies expect files under a user-scoped path such as `USER_ID/file-name.pdf`.

## Deploy To Vercel

Vercel is sufficient for this Next.js application. Supabase provides Auth, PostgreSQL, Storage, and RLS.

1. Import the GitHub repository into Vercel.
2. Keep the framework as Next.js and the root directory as `./`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development as needed.
4. Deploy and copy the resulting domain.
5. In Supabase, open **Authentication > URL Configuration**, set the Vercel domain as the Site URL, and add the local and production redirect URLs.

Render is not required unless a separate long-running RFID worker, scheduled job, or independent API is introduced.

## Production Status

The UI and demo workflows are implemented and the Supabase schema/RLS foundation is included. Some existing screens still use demo fixtures or browser storage while their individual repository queries are being migrated. Before production launch, connect each mutation to Supabase, review all RLS policies, configure private Storage buckets, add monitoring, and rotate any credentials that were shared during development.

## License

Private project. All rights reserved by the project owner.
