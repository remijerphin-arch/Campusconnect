'use client';

import { useState } from 'react';
import { CalendarPlus, Check, CircleDot, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_DRIVES, type DriveStatus } from '@/lib/placementAdminData';

const stages = ['Aptitude', 'Coding', 'Technical', 'Interview', 'HR'];
const statuses: DriveStatus[] = ['upcoming', 'active', 'shortlisting', 'interview', 'completed', 'cancelled'];

export default function DriveManager() {
  const [drives, setDrives] = useState(ADMIN_DRIVES);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rounds, setRounds] = useState(['Aptitude', 'Technical', 'Interview']);

  const updateStatus = (id: string, status: DriveStatus) => {
    setDrives((current) => current.map((drive) => drive.id === id ? { ...drive, status } : drive));
    toast.success('Drive stage updated');
  };
  const createDrive = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !role.trim()) return;
    setDrives((current) => [...current, { id: `drive-${Date.now()}`, companyId: 'company-1', company: name, role, ctcLpa: 0, deadline: '2026-09-30', status: 'upcoming' as const, minCgpa: 7, allowedBacklogs: 0, applicants: 0 }]);
    setName(''); setRole(''); setShowForm(false); toast.success('Placement drive created');
  };
  const addRound = () => { const next = stages.find((stage) => !rounds.includes(stage)); if (next) setRounds((current) => [...current, next]); };

  return <section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-primary"><CircleDot size={20} /><p className="text-sm font-semibold uppercase tracking-[0.2em]">Drive operations</p></div><h2 className="mt-2 text-2xl font-bold">Placement lifecycle</h2><p className="mt-2 text-sm text-muted-foreground">Create drives, configure rounds, and move applications through every stage.</p></div><button type="button" onClick={() => setShowForm((open) => !open)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"><Plus size={16} /> New drive</button></div>{showForm && <form onSubmit={createDrive} className="mt-5 grid gap-3 rounded-2xl border bg-muted/50 p-4 sm:grid-cols-2"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Company name" className="rounded-xl border bg-background px-3 py-2" /><input required value={role} onChange={(event) => setRole(event.target.value)} placeholder="Job role" className="rounded-xl border bg-background px-3 py-2" /><input type="date" required className="rounded-xl border bg-background px-3 py-2" /><input type="number" min="0" step="0.1" placeholder="Package LPA" className="rounded-xl border bg-background px-3 py-2" /><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground sm:col-span-2"><Save size={16} /> Create drive</button></form>}<div className="mt-6 space-y-3">{drives.map((drive) => <div key={drive.id} className="rounded-2xl border p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-semibold">{drive.company} · {drive.role}</p><p className="text-sm text-muted-foreground">{drive.ctcLpa || 'Package pending'} LPA · Deadline {drive.deadline} · {drive.applicants} applicants</p></div><select value={drive.status} onChange={(event) => updateStatus(drive.id, event.target.value as DriveStatus)} className="rounded-xl border bg-background px-3 py-2 text-sm capitalize">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="mt-3 flex flex-wrap items-center gap-2 text-xs">{stages.map((stage) => <span key={stage} className={`rounded-full px-3 py-1 ${rounds.includes(stage) ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{stage}</span>)}</div></div>)}</div><button type="button" onClick={addRound} className="mt-5 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><CalendarPlus size={16} /> Add selection round</button></section>;
}
