insert into public.role_permissions (role_id, permission_key, allowed) values
  ('student', 'attendance.view', true), ('student', 'marks.view', true), ('student', 'placements.view', true), ('student', 'lost_found.view', true), ('student', 'lost_found.create', true),
  ('faculty', 'attendance.view', true), ('faculty', 'attendance.create', true), ('faculty', 'attendance.edit', true), ('faculty', 'attendance.delete', true), ('faculty', 'marks.view', true), ('faculty', 'marks.create', true), ('faculty', 'marks.edit', true), ('faculty', 'marks.delete', true), ('faculty', 'lost_found.view', true),
  ('placement_admin', 'placements.view', true), ('placement_admin', 'placements.create', true), ('placement_admin', 'placements.edit', true), ('placement_admin', 'placements.delete', true), ('placement_admin', 'lost_found.view', true)
on conflict (role_id, permission_key) do update set allowed = excluded.allowed;

create table if not exists public.assessment_types (id uuid primary key default gen_random_uuid(), name text not null, max_score numeric not null default 100, subject_id uuid references public.subjects(id) on delete cascade, created_by uuid references public.profiles(id));
create table if not exists public.notification_preferences (user_id uuid references public.profiles(id) on delete cascade, category text not null, enabled boolean not null default true, primary key(user_id, category));
create table if not exists public.placement_rounds (id uuid primary key default gen_random_uuid(), drive_id uuid not null references public.placement_drives(id) on delete cascade, name text not null, sort_order int not null, scheduled_at timestamptz);
create table if not exists public.placement_applications (id uuid primary key default gen_random_uuid(), drive_id uuid not null references public.placement_drives(id) on delete cascade, student_id uuid not null references public.profiles(id) on delete cascade, status text not null default 'applied', offer_package numeric, offer_document_path text, created_at timestamptz not null default now(), unique(drive_id, student_id));
create table if not exists public.clubs (id uuid primary key default gen_random_uuid(), name text not null, description text, faculty_coordinator uuid references public.profiles(id), status text not null default 'pending', logo_path text);
create table if not exists public.club_members (club_id uuid references public.clubs(id) on delete cascade, student_id uuid references public.profiles(id) on delete cascade, status text not null default 'pending', joined_at timestamptz, primary key(club_id, student_id));

alter table public.assessment_types enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.placement_rounds enable row level security;
alter table public.placement_applications enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
create policy "Authenticated users read assessment types" on public.assessment_types for select to authenticated using (true);
create policy "Faculty manage assessment types" on public.assessment_types for all using (public.has_permission('marks.edit'));
create policy "Users manage notification preferences" on public.notification_preferences for all using (auth.uid() = user_id);
create policy "Placement admins manage rounds" on public.placement_rounds for all using (public.has_permission('placements.edit'));
create policy "Students manage own applications" on public.placement_applications for all using (auth.uid() = student_id);
create policy "Placement admins manage applications" on public.placement_applications for all using (public.has_permission('placements.edit'));
create policy "Authenticated users read clubs" on public.clubs for select to authenticated using (status = 'approved' or public.current_user_role() = 'campus_admin');
create policy "Students manage club requests" on public.club_members for all using (auth.uid() = student_id);
