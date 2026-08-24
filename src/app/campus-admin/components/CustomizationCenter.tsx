'use client';

import { useState } from 'react';
import { Check, GripVertical, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '@/types';
import { getDefaultPermissions, type Permission } from '@/lib/auth/permissions';
import { readModuleSettings, readPermissionSettings, saveModuleSettings, savePermissionSettings } from '@/lib/demoStore';

const moduleNames = ['Academics', 'Attendance', 'Timetable', 'Assignments', 'Exams', 'Placements', 'Lost & Found', 'Community', 'Events', 'Clubs', 'Notifications', 'Resources', 'Leave', 'Help Desk'];
const roleNames: UserRole[] = ['student', 'faculty', 'placement_admin', 'campus_admin'];
const roleLabels: Record<UserRole, string> = { student: 'Student', faculty: 'Faculty', placement_admin: 'Placement Admin', campus_admin: 'Campus Admin' };

const permissionNames: Permission[] = ['attendance.view', 'attendance.create', 'attendance.edit', 'attendance.delete', 'marks.view', 'marks.create', 'marks.edit', 'marks.delete', 'placements.view', 'placements.create', 'placements.edit', 'placements.delete', 'lost_found.view', 'lost_found.create', 'lost_found.moderate', 'users.view', 'users.create', 'users.edit', 'users.delete', 'settings.manage', 'audit_logs.view'];

export default function CustomizationCenter() {
  const [modules, setModules] = useState(() => readModuleSettings() ?? Object.fromEntries(moduleNames.map((name) => [name, true])));
  const [role, setRole] = useState<UserRole>('student');
  const [permissions, setPermissions] = useState<Permission[]>(getDefaultPermissions('student'));
  const toggleModule = (name: string) => { const next = { ...modules, [name]: !modules[name] }; setModules(next); saveModuleSettings(next); toast.success(`${name} module updated`); };
  const selectRole = (nextRole: UserRole) => { setRole(nextRole); const saved = readPermissionSettings(); setPermissions(saved?.[nextRole] ?? getDefaultPermissions(nextRole)); };
  const togglePermission = (permission: Permission) => setPermissions((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]);
  const savePermissions = () => { const saved = readPermissionSettings() ?? {}; savePermissionSettings({ ...saved, [role]: permissions }); toast.success(`${roleLabels[role]} permissions saved`); };

  return <section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Customization center</p><h2 className="mt-2 text-2xl font-bold">Modules and permissions</h2><p className="mt-2 text-sm text-muted-foreground">Control which modules exist and what each role can do. Production enforcement must mirror these rules with Supabase RLS.</p></div><ShieldCheck className="text-primary" size={22} /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]"><div><h3 className="font-semibold">Module management</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{moduleNames.map((name) => <div key={name} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"><span className="flex items-center gap-2"><GripVertical size={14} className="text-muted-foreground" />{name}</span><button type="button" onClick={() => toggleModule(name)} title={`Toggle ${name}`}>{modules[name] ? <ToggleRight className="text-success" size={25} /> : <ToggleLeft className="text-muted-foreground" size={25} />}</button></div>)}</div></div><div><h3 className="font-semibold">Permission matrix</h3><div className="mt-3 flex flex-wrap gap-2">{roleNames.map((item) => <button type="button" key={item} onClick={() => selectRole(item)} className={`rounded-full border px-3 py-1 text-sm ${role === item ? 'bg-primary text-primary-foreground' : ''}`}>{roleLabels[item]}</button>)}</div><div className="mt-4 overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-muted-foreground"><th className="pb-3">Permission</th><th className="pb-3">Allowed</th></tr></thead><tbody>{permissionNames.map((permission) => <tr key={permission} className="border-t"><td className="py-3">{permission}</td><td className="py-3"><button type="button" onClick={() => togglePermission(permission)} title={`Toggle ${permission}`} className="flex items-center gap-2">{permissions.includes(permission) ? <Check className="text-success" size={17} /> : <span className="h-4 w-4 rounded border" />} {permissions.includes(permission) ? 'Yes' : 'No'}</button></td></tr>)}</tbody></table></div><button type="button" onClick={savePermissions} className="mt-4 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground">Save permissions</button></div></div></section>;
}
