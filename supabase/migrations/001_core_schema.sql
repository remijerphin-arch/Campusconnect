create type public.app_role as enum ('student', 'faculty', 'placement_admin', 'campus_admin');
create type public.request_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.app_role not null default 'student',
  department text,
  student_id text unique,
  phone text,
  semester int,
  section text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  name text not null,
  department text not null,
  semester int not null,
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('present', 'absent', 'late')),
  source text not null default 'manual' check (source in ('manual', 'rfid')),
  marked_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(subject_id, student_id, attendance_date)
);

create table public.marks (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assessment_type text not null,
  score numeric not null check (score >= 0),
  max_score numeric not null check (max_score > 0),
  feedback text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz not null,
  file_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  file_path text,
  status text not null default 'submitted',
  score numeric,
  feedback text,
  submitted_at timestamptz not null default now(),
  unique(assignment_id, student_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  location text,
  website text,
  description text,
  logo_path text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.placement_drives (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null,
  package_lpa numeric,
  location text,
  deadline timestamptz not null,
  min_cgpa numeric,
  allowed_backlogs int not null default 0,
  status text not null default 'upcoming',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete cascade,
  category text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  document_path text,
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewer_note text,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  module text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index attendance_student_date_idx on public.attendance(student_id, attendance_date desc);
create index marks_student_subject_idx on public.marks(student_id, subject_id);
create index notifications_recipient_idx on public.notifications(recipient_id, created_at desc);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.attendance enable row level security;
alter table public.marks enable row level security;
alter table public.notifications enable row level security;
alter table public.leave_requests enable row level security;

create policy "Users read their profile" on public.profiles for select using (auth.uid() = id);
create policy "Students read their attendance" on public.attendance for select using (auth.uid() = student_id);
create policy "Faculty manage attendance" on public.attendance for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('faculty', 'campus_admin')));
create policy "Students read their marks" on public.marks for select using (auth.uid() = student_id);
create policy "Faculty manage marks" on public.marks for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('faculty', 'campus_admin')));
create policy "Users read their notifications" on public.notifications for select using (auth.uid() = recipient_id);
create policy "Students manage their leave" on public.leave_requests for all using (auth.uid() = student_id);
create policy "Faculty review leave" on public.leave_requests for update using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('faculty', 'campus_admin')));

create table public.timetable_entries (
  id uuid primary key default gen_random_uuid(), subject_id uuid references public.subjects(id) on delete cascade,
  faculty_id uuid references public.profiles(id), section text not null, weekday int not null check (weekday between 1 and 7),
  starts_at time not null, ends_at time not null, classroom text not null
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null,
  audience public.app_role, department text, subject_id uuid references public.subjects(id), created_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(), title text not null, description text, category text not null,
  starts_at timestamptz not null, venue text, capacity int, organizer text, image_path text, created_by uuid references public.profiles(id)
);
create table public.event_registrations (event_id uuid references public.events(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, registered_at timestamptz not null default now(), primary key(event_id, user_id));
create table public.resources (
  id uuid primary key default gen_random_uuid(), title text not null, description text, department text, semester int,
  subject_id uuid references public.subjects(id), resource_type text not null, file_path text, url text, created_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.lost_found_items (
  id uuid primary key default gen_random_uuid(), item_name text not null, category text not null, description text,
  status text not null default 'lost' check (status in ('lost', 'found', 'claim_pending', 'verified', 'returned', 'closed')),
  location text, event_date date, image_path text, contact text, reported_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.lost_found_claims (
  id uuid primary key default gen_random_uuid(), item_id uuid not null references public.lost_found_items(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade, verification text not null,
  status public.request_status not null default 'pending', reviewed_by uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.community_posts (
  id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null, title text not null, body text not null, is_hidden boolean not null default false, created_at timestamptz not null default now()
);
create table public.community_comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade, author_id uuid not null references public.profiles(id) on delete cascade, body text not null, created_at timestamptz not null default now());
create table public.resource_exchange (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, description text, category text not null, price numeric default 0, location text, contact text, status text not null default 'available', image_path text, created_at timestamptz not null default now()
);
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(), requester_id uuid not null references public.profiles(id) on delete cascade,
  category text not null, subject text not null, body text not null, status text not null default 'open', assigned_to uuid references public.profiles(id), created_at timestamptz not null default now()
);
create table public.custom_fields (
  id uuid primary key default gen_random_uuid(), entity text not null, name text not null, field_type text not null,
  required boolean not null default false, default_value text, visibility public.app_role[], validation jsonb not null default '{}'::jsonb, created_by uuid references public.profiles(id)
);
create table public.custom_field_values (field_id uuid references public.custom_fields(id) on delete cascade, entity_id uuid not null, value jsonb not null, primary key(field_id, entity_id));
create table public.system_settings (key text primary key, value jsonb not null, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now());

alter table public.timetable_entries enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.resources enable row level security;
alter table public.lost_found_items enable row level security;
alter table public.lost_found_claims enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.resource_exchange enable row level security;
alter table public.support_tickets enable row level security;
alter table public.custom_fields enable row level security;
alter table public.custom_field_values enable row level security;
alter table public.system_settings enable row level security;

create policy "Authenticated users read announcements" on public.announcements for select to authenticated using (true);
create policy "Authenticated users read events" on public.events for select to authenticated using (true);
create policy "Users manage event registrations" on public.event_registrations for all using (auth.uid() = user_id);
create policy "Authenticated users read resources" on public.resources for select to authenticated using (true);
create policy "Authenticated users read lost found" on public.lost_found_items for select to authenticated using (true);
create policy "Users create lost found reports" on public.lost_found_items for insert to authenticated with check (auth.uid() = reported_by);
create policy "Users create claims" on public.lost_found_claims for insert to authenticated with check (auth.uid() = claimant_id);
create policy "Authenticated users read community posts" on public.community_posts for select to authenticated using (not is_hidden);
create policy "Users manage own tickets" on public.support_tickets for all using (auth.uid() = requester_id);
create index timetable_weekday_idx on public.timetable_entries(weekday, starts_at);
create index announcements_created_idx on public.announcements(created_at desc);
create index lost_found_status_idx on public.lost_found_items(status, created_at desc);
create index community_posts_created_idx on public.community_posts(created_at desc);

insert into storage.buckets (id, name, public) values
  ('profile-photos', 'profile-photos', false), ('assignment-files', 'assignment-files', false),
  ('submissions', 'submissions', false), ('resumes', 'resumes', false), ('lost-found', 'lost-found', false),
  ('resources', 'resources', false), ('event-media', 'event-media', false), ('company-logos', 'company-logos', false)
on conflict (id) do nothing;

create policy "Users upload to their own private files" on storage.objects for insert to authenticated
with check (bucket_id in ('profile-photos', 'assignment-files', 'submissions', 'resumes', 'lost-found', 'resources', 'event-media', 'company-logos') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read private files" on storage.objects for select to authenticated
using (bucket_id in ('profile-photos', 'assignment-files', 'submissions', 'resumes', 'lost-found', 'resources', 'event-media', 'company-logos') and (storage.foldername(name))[1] = auth.uid()::text);
