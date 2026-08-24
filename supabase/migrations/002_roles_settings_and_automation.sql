create table if not exists public.roles (
  id public.app_role primary key,
  label text not null,
  created_at timestamptz not null default now()
);

insert into public.roles (id, label) values
  ('student', 'Student'), ('faculty', 'Faculty'), ('placement_admin', 'Placement Admin'), ('campus_admin', 'Campus Admin')
on conflict (id) do update set label = excluded.label;

create table if not exists public.permissions (
  key text primary key,
  description text not null
);
create table if not exists public.role_permissions (
  role_id public.app_role references public.roles(id) on delete cascade,
  permission_key text references public.permissions(key) on delete cascade,
  allowed boolean not null default false,
  primary key (role_id, permission_key)
);

insert into public.permissions (key, description) values
  ('attendance.view', 'View attendance'), ('attendance.create', 'Create attendance'), ('attendance.edit', 'Edit attendance'), ('attendance.delete', 'Delete attendance'),
  ('marks.view', 'View marks'), ('marks.create', 'Create marks'), ('marks.edit', 'Edit marks'), ('marks.delete', 'Delete marks'),
  ('placements.view', 'View placements'), ('placements.create', 'Create placement records'), ('placements.edit', 'Edit placement records'), ('placements.delete', 'Delete placement records'),
  ('lost_found.view', 'View lost and found'), ('lost_found.create', 'Create lost and found reports'), ('lost_found.moderate', 'Moderate lost and found'),
  ('users.view', 'View users'), ('users.create', 'Create users'), ('users.edit', 'Edit users'), ('users.delete', 'Delete users'),
  ('settings.manage', 'Manage system settings'), ('audit_logs.view', 'View audit logs')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_key, allowed)
select 'campus_admin'::public.app_role, key, true from public.permissions
on conflict (role_id, permission_key) do update set allowed = true;

create or replace function public.current_user_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.has_permission(required_permission text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.role_permissions rp
    where rp.role_id = public.current_user_role()
      and rp.permission_key = required_permission
      and rp.allowed = true
  )
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), new.email, coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'student'))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
create policy "Authenticated users read roles" on public.roles for select to authenticated using (true);
create policy "Authenticated users read permissions" on public.permissions for select to authenticated using (true);
create policy "Admins manage role permissions" on public.role_permissions for all using (public.current_user_role() = 'campus_admin');

create table if not exists public.module_settings (
  module_key text primary key, enabled boolean not null default true, label text not null, icon text, sort_order int not null default 0, visible_roles public.app_role[] not null default array['student','faculty','placement_admin','campus_admin']::public.app_role[], updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table if not exists public.custom_field_definitions (
  id uuid primary key default gen_random_uuid(), entity text not null, field_key text not null, label text not null, field_type text not null, required boolean not null default false, default_value text, visible_roles public.app_role[] not null default array['student','faculty','placement_admin','campus_admin']::public.app_role[], validation jsonb not null default '{}'::jsonb, created_by uuid references public.profiles(id), created_at timestamptz not null default now(), unique(entity, field_key)
);
alter table public.system_settings add column if not exists type text not null default 'json';
alter table public.system_settings add column if not exists category text not null default 'General';
alter table public.system_settings add column if not exists description text;

insert into public.module_settings (module_key, label, sort_order) values
  ('academics','Academics',1), ('attendance','Attendance',2), ('marks','Marks',3), ('assignments','Assignments',4), ('exams','Exams',5), ('timetable','Timetable',6), ('results','Results',7), ('placements','Placements',8), ('lost_found','Lost & Found',9), ('events','Events',10), ('clubs','Clubs',11), ('community','Community',12), ('resources','Resources',13), ('leave','Leave',14), ('help_desk','Help Desk',15), ('notifications','Notifications',16), ('feedback','Feedback',17)
on conflict (module_key) do nothing;

alter table public.module_settings enable row level security;
alter table public.custom_field_definitions enable row level security;
create policy "Authenticated users read enabled modules" on public.module_settings for select to authenticated using (enabled = true or public.current_user_role() = 'campus_admin');
create policy "Admins manage modules" on public.module_settings for all using (public.has_permission('settings.manage'));
create policy "Authenticated users read custom fields" on public.custom_field_definitions for select to authenticated using (public.current_user_role() = any(visible_roles));
create policy "Admins manage custom fields" on public.custom_field_definitions for all using (public.has_permission('settings.manage'));

create policy "Faculty manage assignments" on public.assignments for all using (public.has_permission('marks.create'));
create policy "Students read assignments" on public.assignments for select using (auth.uid() is not null);
create policy "Students manage submissions" on public.submissions for all using (auth.uid() = student_id);
create policy "Faculty review submissions" on public.submissions for update using (public.has_permission('marks.edit'));
create policy "Authenticated users read timetable" on public.timetable_entries for select to authenticated using (true);
create policy "Faculty manage announcements" on public.announcements for insert to authenticated with check (public.current_user_role() in ('faculty', 'campus_admin'));
create policy "Admins manage audit logs" on public.audit_logs for select using (public.has_permission('audit_logs.view'));
