'use client';

import Link from 'next/link';
import { ArrowUpRight, CalendarDays, ClipboardList, GraduationCap, Megaphone } from 'lucide-react';
import { MOCK_DASHBOARD_STATS, MOCK_STUDENT_DETAILS, MOCK_UPCOMING_CLASSES, MOCK_UPCOMING_EXAMS } from '@/lib/mockData';
import { readAdminSettings } from '@/lib/demoStore';

const defaultWidgets = ['profile', 'classes', 'exams', 'announcements', 'deadlines'];

export default function StudentHomeOverview() {
  const widgets = readAdminSettings()?.studentWidgets ?? defaultWidgets;
  const profileCompletion = 88;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      {widgets.includes('profile') && <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Student profile</p><h1 className="mt-2 text-3xl font-bold">Good morning, {MOCK_STUDENT_DETAILS.name.split(' ')[0]}</h1><p className="mt-2 text-sm text-muted-foreground">{MOCK_STUDENT_DETAILS.program}</p></div><GraduationCap className="text-primary" size={28} /></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Student ID</p><p className="mt-1 font-semibold">{MOCK_STUDENT_DETAILS.rollNumber}</p></div><div><p className="text-xs text-muted-foreground">Semester</p><p className="mt-1 font-semibold">{MOCK_STUDENT_DETAILS.semester}</p></div><div><p className="text-xs text-muted-foreground">Section</p><p className="mt-1 font-semibold">{MOCK_STUDENT_DETAILS.section}</p></div></div>
        <div className="mt-6"><div className="flex justify-between text-sm"><span>Profile completion</span><span className="font-semibold text-primary">{profileCompletion}%</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${profileCompletion}%` }} /></div></div>
        <Link href="/student-profile" className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">Complete profile <ArrowUpRight size={16} /></Link>
      </div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-[1.5rem] border bg-primary p-5 text-primary-foreground"><p className="text-sm opacity-80">Current CGPA</p><p className="mt-2 text-4xl font-bold">{MOCK_DASHBOARD_STATS.currentCgpa}</p><p className="mt-1 text-sm opacity-80">Attendance {MOCK_DASHBOARD_STATS.attendancePct}%</p></div>
        {widgets.includes('classes') && <div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><div className="flex items-center gap-2 font-semibold"><CalendarDays size={18} className="text-primary" />Next classes</div>{MOCK_UPCOMING_CLASSES.slice(0, 2).map((item) => <div key={item.id} className="mt-3 flex justify-between text-sm"><span>{item.subject}<span className="block text-xs text-muted-foreground">{item.room}</span></span><span className="font-semibold">{item.time}</span></div>)}</div>}
      </div>
      {widgets.includes('exams') && <div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><div className="flex items-center gap-2 font-semibold"><ClipboardList size={18} className="text-primary" />Upcoming exams</div>{MOCK_UPCOMING_EXAMS.map((item) => <div key={item.id} className="mt-3 flex justify-between text-sm"><span>{item.subject}<span className="block text-xs text-muted-foreground">{item.mode}</span></span><span className="font-semibold">{item.date}</span></div>)}</div>}
      {widgets.includes('announcements') && <div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><div className="flex items-center gap-2 font-semibold"><Megaphone size={18} className="text-primary" />Announcements</div><p className="mt-3 text-sm text-muted-foreground">Mid-semester examination timetable has been published.</p><p className="mt-2 text-sm text-muted-foreground">Career readiness workshop registrations close Friday.</p></div>}
      {widgets.includes('deadlines') && <div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Important deadline</p><p className="mt-3 font-semibold">Compiler lab record submission</p><p className="mt-1 text-sm text-muted-foreground">Due August 26, 2026</p></div>}
    </section>
  );
}
