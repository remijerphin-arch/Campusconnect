'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, BriefcaseBusiness, CalendarDays, CheckCircle2, ChefHat, ClipboardCheck, HeartPulse, IdCard, LayoutDashboard, Plus, ShieldAlert, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import { createCanteenOrder, readCareerProgress, readCanteenOrders, readEmergencyCheckIns, saveCareerProgress, saveEmergencyCheckIn, type CareerProgress } from '@/lib/demoStore';
import { getDemoStudentByEmail, type DemoStudentProfile } from '@/lib/studentDemoData';

type HubTab = 'today' | 'career' | 'identity' | 'portfolio' | 'canteen' | 'safety' | 'family';

const tabs: Array<{ id: HubTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'today', label: 'Today', icon: LayoutDashboard },
  { id: 'career', label: 'Career prep', icon: BriefcaseBusiness },
  { id: 'identity', label: 'Digital ID', icon: IdCard },
  { id: 'portfolio', label: 'Portfolio', icon: BadgeCheck },
  { id: 'canteen', label: 'Canteen', icon: ChefHat },
  { id: 'safety', label: 'Safety', icon: HeartPulse },
  { id: 'family', label: 'Family', icon: UsersRound },
];

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-background/70 p-4">{children}</div>;
}

export default function CampusHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('today');
  const [student, setStudent] = useState<DemoStudentProfile | null>(null);
  const [career, setCareer] = useState<CareerProgress>({ resumeReady: false, mockInterviews: 0, aptitudeSessions: 0, skills: [] });
  const [skillDraft, setSkillDraft] = useState('');
  const [orders, setOrders] = useState(() => readCanteenOrders());
  const [pickupTime, setPickupTime] = useState('12:45 PM');
  const [emergencyNote, setEmergencyNote] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<'Safe' | 'Need assistance' | null>(null);

  useEffect(() => {
    const email = window.localStorage.getItem('campusconnect-demo-email') ?? '';
    const activeStudent = getDemoStudentByEmail(email);
    setStudent(activeStudent);
    if (activeStudent) {
      setCareer(readCareerProgress(activeStudent.email));
      const savedCheckIn = readEmergencyCheckIns().find((item) => item.studentEmail === activeStudent.email);
      setCheckInStatus(savedCheckIn?.status ?? null);
    }
  }, []);

  const updateCareer = (next: CareerProgress) => {
    setCareer(next);
    if (student) saveCareerProgress(student.email, next);
  };

  const placeOrder = (itemName: string, amount: number) => {
    if (!student) return;
    createCanteenOrder({ studentEmail: student.email, itemName, amount, pickupTime });
    setOrders(readCanteenOrders());
    toast.success(`${itemName} reserved for ${pickupTime}`);
  };

  const checkIn = (status: 'Safe' | 'Need assistance') => {
    if (!student) return;
    saveEmergencyCheckIn({ studentEmail: student.email, studentName: student.name, status, note: emergencyNote.trim() || undefined });
    setCheckInStatus(status);
    toast.success(status === 'Safe' ? 'Your safety check-in is recorded' : 'Campus support has been alerted');
  };

  if (!student) return <p className="mt-5 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">Sign in as a student to use your personalized campus hub.</p>;

  const familyCode = `CC-${student.registerNumber.slice(-4)}-${student.dateOfBirth.slice(-2)}`;
  const myOrders = orders.filter((order) => order.studentEmail === student.email).slice(0, 3);

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Campus companion</p>
          <h2 className="mt-2 text-2xl font-bold">Plan, prepare, and stay connected</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your daily schedule, placement readiness, digital identity, and campus services in one workspace.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-sm font-semibold text-success"><CheckCircle2 size={16} /> Student services active</span>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${activeTab === id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Icon size={15} />{label}</button>)}
      </div>

      {activeTab === 'today' && <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card><div className="flex items-center gap-2"><CalendarDays className="text-primary" size={19} /><h3 className="font-bold">Your day at a glance</h3></div><div className="mt-4 space-y-3">{[['09:00', 'Computer Networks', 'Room 108'], ['11:30', 'Operating Systems', 'Room 301'], ['14:00', 'Placement aptitude practice', 'Career Studio'], ['17:30', 'Cloud study circle', 'Seminar Hall 2']].map(([time, title, place]) => <div key={title} className="flex gap-4 rounded-xl border-l-4 border-primary bg-muted/40 p-3"><span className="w-12 text-sm font-bold text-primary">{time}</span><span><span className="block font-semibold">{title}</span><span className="text-xs text-muted-foreground">{place}</span></span></div>)}</div></Card>
        <Card><p className="text-sm font-semibold text-primary">Focus for placement</p><p className="mt-2 text-3xl font-bold">{Math.min(100, 35 + career.mockInterviews * 10 + career.aptitudeSessions * 8 + (career.resumeReady ? 25 : 0))}%</p><p className="mt-1 text-sm text-muted-foreground">Readiness score based on your completed preparation.</p><button type="button" onClick={() => setActiveTab('career')} className="mt-5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Continue preparing</button></Card>
      </div>}

      {activeTab === 'career' && <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card><p className="font-bold">Resume readiness</p><p className="mt-2 text-sm text-muted-foreground">Keep a current resume before applying to campus drives.</p><button type="button" onClick={() => updateCareer({ ...career, resumeReady: !career.resumeReady })} className={`mt-5 rounded-xl px-3 py-2 text-sm font-semibold ${career.resumeReady ? 'bg-success/10 text-success' : 'bg-primary text-primary-foreground'}`}>{career.resumeReady ? 'Resume marked ready' : 'Mark resume ready'}</button></Card>
        <Card><p className="font-bold">Mock interviews</p><p className="mt-2 text-3xl font-bold">{career.mockInterviews}</p><button type="button" onClick={() => updateCareer({ ...career, mockInterviews: career.mockInterviews + 1 })} className="mt-5 rounded-xl border px-3 py-2 text-sm font-semibold">Log practice interview</button></Card>
        <Card><p className="font-bold">Aptitude sessions</p><p className="mt-2 text-3xl font-bold">{career.aptitudeSessions}</p><button type="button" onClick={() => updateCareer({ ...career, aptitudeSessions: career.aptitudeSessions + 1 })} className="mt-5 rounded-xl border px-3 py-2 text-sm font-semibold">Complete practice set</button></Card>
        <div className="lg:col-span-3"><Card><p className="font-bold">Skills checklist</p><div className="mt-3 flex flex-wrap gap-2">{career.skills.map((skill) => <button type="button" key={skill} onClick={() => updateCareer({ ...career, skills: career.skills.filter((item) => item !== skill) })} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{skill} ×</button>)}</div><div className="mt-4 flex gap-2"><input value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} placeholder="Add a skill, e.g. React" className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm" /><button type="button" onClick={() => { const skill = skillDraft.trim(); if (skill && !career.skills.includes(skill)) updateCareer({ ...career, skills: [...career.skills, skill] }); setSkillDraft(''); }} className="rounded-xl bg-primary px-3 py-2 text-primary-foreground"><Plus size={17} /></button></div></Card></div>
      </div>}

      {activeTab === 'identity' && <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.8fr]"><div className="rounded-[1.75rem] bg-slate-950 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">CampusConnect digital ID</p><div className="mt-7 flex items-end justify-between gap-4"><div><p className="text-2xl font-bold">{student.name}</p><p className="mt-1 text-sm text-white/70">{student.registerNumber} · {student.department}</p><p className="mt-5 text-xs text-white/60">Valid for campus services</p></div><div className="grid h-20 w-20 grid-cols-5 gap-1 rounded-lg bg-white p-2">{Array.from({ length: 25 }, (_, index) => <span key={index} className={`rounded-[1px] ${[0, 1, 4, 6, 8, 10, 12, 14, 18, 20, 22, 24].includes(index) ? 'bg-slate-950' : index % 3 === 0 ? 'bg-slate-500' : 'bg-white'}`} />)}</div></div></div><Card><p className="font-bold">ID verification</p><p className="mt-2 text-sm text-muted-foreground">Use this digital card for events, library visits, and campus service check-ins.</p><div className="mt-5 space-y-2 text-sm"><p><span className="text-muted-foreground">Programme:</span> {student.program}</p><p><span className="text-muted-foreground">Semester:</span> {student.semester}</p><p><span className="text-muted-foreground">Status:</span> <span className="font-semibold text-success">Active</span></p></div></Card></div>}

      {activeTab === 'portfolio' && <div className="mt-6 grid gap-4 md:grid-cols-2"><Card><p className="font-bold">Achievement portfolio</p><p className="mt-2 text-sm text-muted-foreground">A placement-ready view of your verified work.</p><div className="mt-4 space-y-2">{[...student.projects, ...student.certifications].slice(0, 5).map((item) => <div key={item} className="rounded-xl bg-muted p-3 text-sm font-medium">{item}</div>)}</div></Card><Card><p className="font-bold">Public links</p><div className="mt-4 space-y-3 text-sm"><p><span className="text-muted-foreground">Portfolio:</span> {student.portfolio}</p><p><span className="text-muted-foreground">LinkedIn:</span> {student.linkedin}</p><p><span className="text-muted-foreground">GitHub:</span> {student.github}</p></div><button type="button" onClick={() => toast.success('Portfolio link copied')} className="mt-5 rounded-xl border px-3 py-2 text-sm font-semibold">Copy portfolio link</button></Card></div>}

      {activeTab === 'canteen' && <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]"><Card><p className="font-bold">Pre-order from South Canteen</p><p className="mt-2 text-sm text-muted-foreground">Reserve a pickup slot and skip the queue.</p><label className="mt-4 block text-sm font-medium">Pickup time<select value={pickupTime} onChange={(event) => setPickupTime(event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2"><option>12:45 PM</option><option>01:15 PM</option><option>01:45 PM</option></select></label><div className="mt-4 grid gap-2 sm:grid-cols-2">{[['Vegetable Meals', 60], ['Chicken Biriyani', 120], ['Paneer Sandwich', 60], ['Cold Coffee', 45]].map(([item, price]) => <button type="button" key={String(item)} onClick={() => placeOrder(String(item), Number(price))} className="flex items-center justify-between rounded-xl border p-3 text-left hover:border-primary"><span className="font-semibold">{item}</span><span className="text-primary">Rs {price}</span></button>)}</div></Card><Card><p className="font-bold">Your orders</p><div className="mt-4 space-y-2">{myOrders.length ? myOrders.map((order) => <div key={order.id} className="rounded-xl bg-muted p-3 text-sm"><p className="font-semibold">{order.itemName}</p><p className="mt-1 text-muted-foreground">Pickup {order.pickupTime} · Rs {order.amount}</p><span className="mt-2 inline-block rounded-full bg-warning/10 px-2 py-1 text-xs font-semibold text-warning">{order.status}</span></div>) : <p className="text-sm text-muted-foreground">No pre-orders yet.</p>}</div></Card></div>}

      {activeTab === 'safety' && <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]"><Card><div className="flex items-center gap-2 text-danger"><ShieldAlert size={20} /><p className="font-bold">Campus emergency check-in</p></div><p className="mt-2 text-sm text-muted-foreground">During an alert, let campus support know whether you are safe or need assistance.</p><textarea value={emergencyNote} onChange={(event) => setEmergencyNote(event.target.value)} placeholder="Optional location or assistance note" className="mt-4 min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-sm" /><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => checkIn('Safe')} className="rounded-xl bg-success px-4 py-2 text-sm font-semibold text-success-foreground">I am safe</button><button type="button" onClick={() => checkIn('Need assistance')} className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-danger-foreground">Need assistance</button></div></Card><Card><p className="font-bold">Check-in status</p><p className={`mt-4 text-2xl font-bold ${checkInStatus === 'Need assistance' ? 'text-danger' : checkInStatus === 'Safe' ? 'text-success' : ''}`}>{checkInStatus ?? 'Not submitted'}</p><p className="mt-2 text-sm text-muted-foreground">Emergency contact: {student.emergencyContact}</p></Card></div>}

      {activeTab === 'family' && <div className="mt-6 grid gap-4 md:grid-cols-2"><Card><p className="font-bold">Parent view invitation</p><p className="mt-2 text-sm text-muted-foreground">Share this one-time demo code to give family a read-only summary of attendance, marks, leave status, and important notices.</p><p className="mt-5 rounded-xl bg-primary/10 px-4 py-3 font-mono text-lg font-bold text-primary">{familyCode}</p><button type="button" onClick={() => toast.success('Parent invitation code copied')} className="mt-4 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Copy invitation code</button></Card><Card><p className="font-bold">Shared summary</p><div className="mt-4 space-y-2 text-sm"><p>Attendance: <span className="font-semibold">83%</span></p><p>Current CGPA: <span className="font-semibold">{student.academicPerformance.cgpa}</span></p><p>Leave status: <span className="font-semibold text-success">No active leave</span></p><p>Notices: <span className="font-semibold">2 unread</span></p></div></Card></div>}
    </section>
  );
}
