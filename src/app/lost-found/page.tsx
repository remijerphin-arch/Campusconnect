'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ImagePlus, Search, ShieldAlert } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';

type ItemStatus = 'Open' | 'Claim Pending' | 'Verification' | 'Approved' | 'Rejected' | 'Returned' | 'Closed';
type ReportType = 'lost' | 'found';
type Section = 'all' | 'lost' | 'found' | 'my-reports' | 'my-claims';

interface Item {
  id: string;
  title: string;
  category: string;
  description: string;
  type: ReportType;
  location: string;
  date: string;
  status: ItemStatus;
  storage?: string;
}

const initialItems: Item[] = [{ id: 'lf-1', title: 'Black calculator', category: 'Electronics', description: 'Scientific calculator found after the afternoon lab.', type: 'found', location: 'Block B', date: '2026-08-24', status: 'Open', storage: 'Security office' }];
const categories = ['All', 'ID Card', 'Wallet', 'Phone', 'Laptop', 'Books', 'Electronics', 'Other'];

export default function LostFoundPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState<'all' | ReportType>('all');
  const [showForm, setShowForm] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('lost');
  const [title, setTitle] = useState('');
  const [claiming, setClaiming] = useState<Item | null>(null);
  const [verification, setVerification] = useState('');
  const visible = useMemo(() => items.filter((item) => (!query || `${item.title} ${item.location}`.toLowerCase().includes(query.toLowerCase())) && (category === 'All' || item.category === category) && (type === 'all' || item.type === type)), [category, items, query, type]);
  const submitReport = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setItems((current) => [{ id: `lf-${Date.now()}`, title, category: category === 'All' ? 'Other' : category, description: 'Reported by current user', type: reportType, location: 'Campus', date: new Date().toISOString().slice(0, 10), status: 'Open' }, ...current]); setTitle(''); setShowForm(false); toast.success(`${reportType === 'lost' ? 'Lost' : 'Found'} item reported`); };
  const submitClaim = () => { if (!claiming || !verification.trim()) return; setItems((current) => current.map((item) => item.id === claiming.id ? { ...item, status: 'Claim Pending' } : item)); setClaiming(null); setVerification(''); toast.success('Claim sent to moderators'); };
  return <AppLayout currentPath="/lost-found"><div className="mx-auto max-w-6xl space-y-6"><section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Campus recovery</p><h1 className="mt-2 text-3xl font-bold">Lost & Found</h1><p className="mt-2 text-sm text-muted-foreground">Search reports, submit items, and verify claims privately with moderators.</p></div><button type="button" onClick={() => setShowForm((current) => !current)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"><ImagePlus size={17} /> Report item</button></div><div className="mt-6 flex flex-wrap gap-2"><a href="/lost-found" className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">All</a><a href="/lost-found/lost" className="rounded-full border px-3 py-1 text-sm">Lost</a><a href="/lost-found/found" className="rounded-full border px-3 py-1 text-sm">Found</a><a href="/lost-found/my-reports" className="rounded-full border px-3 py-1 text-sm">My reports</a><a href="/lost-found/my-claims" className="rounded-full border px-3 py-1 text-sm">My claims</a></div></section>{showForm && <form onSubmit={submitReport} className="rounded-[2rem] border bg-card p-6 shadow-card"><h2 className="text-2xl font-bold">Create report</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><select value={reportType} onChange={(event) => setReportType(event.target.value as ReportType)} className="rounded-xl border bg-background px-3 py-2"><option value="lost">Lost item</option><option value="found">Found item</option></select><select value={category === 'All' ? 'Other' : category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border bg-background px-3 py-2">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Item title" className="rounded-xl border bg-background px-3 py-2 sm:col-span-2" /><textarea required placeholder="Description, date, time, location, and contact preference" className="min-h-24 rounded-xl border bg-background px-3 py-2 sm:col-span-2" /><label className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm"><ImagePlus size={16} /> Add image<input type="file" accept="image/*" className="hidden" /></label></div><button type="submit" className="mt-4 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground">Submit report</button></form>}<section className="rounded-[2rem] border bg-card p-6 shadow-card"><div className="grid gap-3 md:grid-cols-[1fr_180px_140px]"><div className="flex items-center gap-2 rounded-xl border px-3"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search item or location" className="w-full bg-transparent py-2 outline-none" /></div><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border bg-background px-3 py-2">{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={type} onChange={(event) => setType(event.target.value as 'all' | ReportType)} className="rounded-xl border bg-background px-3 py-2"><option value="all">Lost & found</option><option value="lost">Lost only</option><option value="found">Found only</option></select></div><div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map((item) => <article key={item.id} className="rounded-2xl border p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{item.category} · {item.type} · {item.location}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{item.status}</span></div><p className="mt-3 text-sm text-muted-foreground">{item.description}</p><p className="mt-3 text-xs text-muted-foreground">{item.date}{item.storage ? ` · Stored at ${item.storage}` : ''}</p>{item.type === 'found' && item.status === 'Open' && <button type="button" onClick={() => setClaiming(item)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><ShieldAlert size={15} /> I think this is mine</button>}</article>)}</div></section>{claiming && <section className="rounded-[2rem] border border-primary/30 bg-primary/5 p-6"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="text-primary" size={18} /> Verify claim for {claiming.title}</div><p className="mt-2 text-sm text-muted-foreground">Only moderators will see this ownership detail.</p><textarea value={verification} onChange={(event) => setVerification(event.target.value)} placeholder="Private verification information" className="mt-4 min-h-24 w-full rounded-xl border bg-background px-3 py-2" /><button type="button" onClick={submitClaim} className="mt-3 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground">Submit claim</button></section>}</div></AppLayout>;
}
