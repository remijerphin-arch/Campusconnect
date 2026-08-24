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
