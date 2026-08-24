'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  LockKeyhole,
  Pencil,
  Radio,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
} from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/lib/mockData';
import { readAdminSettings, saveAdminSettings, type AdminSettings } from '@/lib/demoStore';
import type { UserRole } from '@/types';

const defaultSettings: AdminSettings = {
  services: {
    studentPortal: true,
    facultyWorkspace: true,
    placementServices: true,
    communityBoard: true,
  },
  rfidEnabled: true,
  maintenanceMode: false,
  studentWidgets: ['profile', 'classes', 'exams', 'announcements', 'deadlines'],
};

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  placement_admin: 'Placement Admin',
  campus_admin: 'Campus Admin',
};

const serviceLabels = [
  ['studentPortal', 'Student portal', 'Academic dashboards, attendance, and student updates.'],
  ['facultyWorkspace', 'Faculty workspace', 'Subject rosters, attendance, and marks entry.'],
  ['placementServices', 'Placement services', 'Company, drive, eligibility, and candidate workflows.'],
  ['communityBoard', 'Community board', 'Lost-and-found and resource exchange posts.'],
] as const;

const widgetLabels = [
  ['profile', 'Profile summary'],
  ['classes', 'Upcoming classes'],
  ['exams', 'Upcoming exams'],
  ['announcements', 'Announcements'],
  ['deadlines', 'Important deadlines'],
] as const;

export default function CampusAdminConsole() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [users, setUsers] = useState(() =>
    DEMO_CREDENTIALS.map((user) => ({ ...user, active: true }))
  );
  const [activity, setActivity] = useState<string[]>(['Admin console initialized']);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<UserRole>('student');

  useEffect(() => {
    setSettings({ ...defaultSettings, ...readAdminSettings(), studentWidgets: readAdminSettings()?.studentWidgets ?? defaultSettings.studentWidgets });
  }, []);

  const record = (message: string) => {
    setActivity((current) => [message, ...current].slice(0, 5));
  };

  const updateSetting = (key: keyof AdminSettings['services']) => {
    const next = {
      ...settings,
      services: { ...settings.services, [key]: !settings.services[key] },
    };
    setSettings(next);
    saveAdminSettings(next);
    record(`${serviceLabels.find(([service]) => service === key)?.[1]} ${next.services[key] ? 'enabled' : 'disabled'}`);
  };

  const toggleGlobal = (key: 'rfidEnabled' | 'maintenanceMode') => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveAdminSettings(next);
    record(`${key === 'rfidEnabled' ? 'RFID sync' : 'Maintenance mode'} ${next[key] ? 'enabled' : 'disabled'}`);
  };

  const toggleUser = (email: string) => {
    setUsers((current) => current.map((user) => (
      user.email === email ? { ...user, active: !user.active } : user
    )));
    const user = users.find((item) => item.email === email);
    record(`${user?.label} access ${user?.active ? 'disabled' : 'enabled'}`);
  };

  const beginRoleEdit = (email: string, role: UserRole) => {
    setEditingUser(email);
    setRoleDraft(role);
  };

  const saveRole = (email: string) => {
    setUsers((current) => current.map((user) => (
      user.email === email ? { ...user, roleKey: roleDraft } : user
    )));
    setEditingUser(null);
    record(`Role updated to ${roleLabels[roleDraft]}`);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveAdminSettings(defaultSettings);
    record('System settings reset to defaults');
  };

  const toggleWidget = (widget: string) => {
    const studentWidgets = settings.studentWidgets.includes(widget)
      ? settings.studentWidgets.filter((item) => item !== widget)
      : [...settings.studentWidgets, widget];
    const next = { ...settings, studentWidgets };
    setSettings(next);
    saveAdminSettings(next);
    record(`${widgetLabels.find(([key]) => key === widget)?.[1]} ${studentWidgets.includes(widget) ? 'enabled' : 'disabled'}`);
  };

  const moveWidget = (widget: string, direction: -1 | 1) => {
    const index = settings.studentWidgets.indexOf(widget);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= settings.studentWidgets.length) return;
    const studentWidgets = [...settings.studentWidgets];
    [studentWidgets[index], studentWidgets[nextIndex]] = [studentWidgets[nextIndex], studentWidgets[index]];
    const next = { ...settings, studentWidgets };
    setSettings(next);
    saveAdminSettings(next);
    record(`${widgetLabels.find(([key]) => key === widget)?.[1]} order updated`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Campus administration</p>
            <h1 className="mt-2 text-3xl font-bold">CampusConnect control center</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Manage access, platform services, attendance integrations, and operational safeguards from one place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-sm font-semibold text-success"><Activity size={16} /> System online</div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-muted/50 p-4"><Users size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">{users.length}</p><p className="text-sm text-muted-foreground">Managed accounts</p></div>
          <div className="rounded-2xl border bg-muted/50 p-4"><Database size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">Supabase</p><p className="text-sm text-muted-foreground">Cloud provider</p></div>
          <div className="rounded-2xl border bg-muted/50 p-4"><Radio size={18} className="text-primary" /><p className="mt-3 text-2xl font-bold">{settings.rfidEnabled ? 'Active' : 'Paused'}</p><p className="text-sm text-muted-foreground">RFID attendance</p></div>
        </div>
      </section>

      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Access management</p><h2 className="mt-2 text-2xl font-bold">Users and roles</h2><p className="mt-2 text-sm text-muted-foreground">Enable or disable access and correct a user&apos;s workspace role.</p></div><LockKeyhole className="text-primary" size={22} /></div>
        <div className="mt-6 space-y-3">
          {users.map((user) => (
            <div key={user.email} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                {editingUser === user.email ? <><select value={roleDraft} onChange={(event) => setRoleDraft(event.target.value as UserRole)} className="rounded-xl border bg-background px-3 py-2 text-sm"><option value="student">Student</option><option value="faculty">Faculty</option><option value="placement_admin">Placement Admin</option><option value="campus_admin">Campus Admin</option></select><button type="button" onClick={() => saveRole(user.email)} className="rounded-xl bg-primary p-2 text-primary-foreground" title="Save role"><Check size={16} /></button></> : <><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{roleLabels[user.roleKey]}</span><button type="button" onClick={() => beginRoleEdit(user.email, user.roleKey)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" title="Edit role"><Pencil size={16} /></button></>}
                <button type="button" onClick={() => toggleUser(user.email)} className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold ${user.active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`} title="Toggle user access">{user.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}{user.active ? 'Active' : 'Disabled'}</button>
                <button type="button" onClick={() => record(`Account review opened for ${user.label}`)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" title="Review account"><Settings2 size={16} /></button>
                <button type="button" onClick={() => record(`Account removal requested for ${user.label}`)} className="rounded-xl p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger" title="Remove account"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Platform controls</p><h2 className="mt-2 text-2xl font-bold">Services and integrations</h2></div><ShieldCheck className="text-primary" size={22} /></div>
          <div className="mt-6 space-y-3">{serviceLabels.map(([key, title, description]) => <button key={key} type="button" onClick={() => updateSetting(key)} className="flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left hover:border-primary"><span><span className="block font-semibold">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></span>{settings.services[key] ? <ToggleRight className="shrink-0 text-success" size={28} /> : <ToggleLeft className="shrink-0 text-muted-foreground" size={28} />}</button>)}</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => toggleGlobal('rfidEnabled')} className="flex items-center justify-between rounded-2xl border p-4 text-left"><span><span className="block font-semibold">RFID sync</span><span className="text-sm text-muted-foreground">Attendance event ingestion</span></span>{settings.rfidEnabled ? <ToggleRight className="text-success" size={26} /> : <ToggleLeft className="text-muted-foreground" size={26} />}</button><button type="button" onClick={() => toggleGlobal('maintenanceMode')} className="flex items-center justify-between rounded-2xl border p-4 text-left"><span><span className="block font-semibold">Maintenance mode</span><span className="text-sm text-muted-foreground">Pause student-facing services</span></span>{settings.maintenanceMode ? <ToggleRight className="text-warning" size={26} /> : <ToggleLeft className="text-muted-foreground" size={26} />}</button></div>
          <button type="button" onClick={resetSettings} className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"><RotateCcw size={16} /> Reset settings</button>
          <div className="mt-8 border-t pt-6"><p className="font-semibold">Student dashboard widgets</p><p className="mt-1 text-sm text-muted-foreground">Enable cards and change their order on the student home dashboard.</p><div className="mt-3 space-y-2">{widgetLabels.map(([key, label]) => <div key={key} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"><span>{label}</span><span className="flex items-center gap-1">{settings.studentWidgets.includes(key) && <><button type="button" onClick={() => moveWidget(key, -1)} className="rounded-lg p-1 hover:bg-muted" title={`Move ${label} up`}><ChevronUp size={16} /></button><button type="button" onClick={() => moveWidget(key, 1)} className="rounded-lg p-1 hover:bg-muted" title={`Move ${label} down`}><ChevronDown size={16} /></button></>}<button type="button" onClick={() => toggleWidget(key)} className="rounded-lg p-1">{settings.studentWidgets.includes(key) ? <ToggleRight className="text-success" size={24} /> : <ToggleLeft className="text-muted-foreground" size={24} />}</button></span></div>)}</div></div>
        </section>
        <section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Audit activity</p><h2 className="mt-2 text-2xl font-bold">Recent admin actions</h2></div><Save className="text-primary" size={22} /></div><div className="mt-6 space-y-3">{activity.map((item, index) => <div key={`${item}-${index}`} className="flex gap-3 rounded-xl bg-muted/50 p-3 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-success" /><span>{item}</span></div>)}</div></section>
      </div>
    </div>
  );
}
