'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, ClipboardList, GraduationCap, Megaphone } from 'lucide-react';
import { readAdminSettings } from '@/lib/demoStore';
import { getDemoStudentByEmail } from '@/lib/studentDemoData';

const defaultWidgets = ['profile', 'classes', 'exams', 'announcements', 'deadlines'];

export default function StudentHomeOverview() {
  const [studentProfile, setStudentProfile] = useState<ReturnType<typeof getDemoStudentByEmail> | null>(null);
  const widgets = readAdminSettings()?.studentWidgets ?? defaultWidgets;
  const profileCompletion = 88;

  useEffect(() => {
    const email = window.localStorage.getItem('campusconnect-demo-email');
    if (email) {
      const nextStudent = getDemoStudentByEmail(email);
      if (nextStudent) {
        setStudentProfile(nextStudent);
      }
    }
  }, []);

  const firstName = studentProfile?.fullName?.split(' ')[0] ?? 'Student';
  const studentId = studentProfile?.registerNumber ?? 'N/A';
  const semester = studentProfile?.currentSemester ?? 5;
  const section = studentProfile?.section ?? 'A';
  const cgpa = studentProfile?.academicPerformance?.cgpa ?? 8.4;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      {widgets.includes('profile') && (
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Student profile</p>
              <h1 className="mt-2 text-3xl font-bold">Good morning, {firstName}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{studentProfile?.department ?? 'Artificial Intelligence and Machine Learning'}</p>
            </div>
            <GraduationCap className="text-primary" size={28} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Student ID</p><p className="mt-1 font-semibold">{studentId}</p></div>
            <div><p className="text-xs text-muted-foreground">Semester</p><p className="mt-1 font-semibold">{semester}</p></div>
            <div><p className="text-xs text-muted-foreground">Section</p><p className="mt-1 font-semibold">{section}</p></div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm"><span>Profile completion</span><span className="font-semibold text-primary">{profileCompletion}%</span></div>
            <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${profileCompletion}%` }} /></div>
          </div>
          <Link href="/student-profile" className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">Complete profile <ArrowUpRight size={16} /></Link>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-[1.5rem] border bg-primary p-5 text-primary-foreground"><p className="text-sm opacity-80">Current CGPA</p><p className="mt-2 text-4xl font-bold">{cgpa}</p><p className="mt-1 text-sm opacity-80">Attendance {studentProfile?.attendance?.length ? Math.round(studentProfile.attendance.reduce((sum, item) => sum + item.percentage, 0) / studentProfile.attendance.length) : 84}%</p></div>
        {widgets.includes('classes') && (
          <div className="rounded-[1.5rem] border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 font-semibold"><CalendarDays size={18} className="text-primary" />Next classes</div>
            <div className="mt-3 flex justify-between text-sm"><span>Data Structures<span className="block text-xs text-muted-foreground">B-204</span></span><span className="font-semibold">09:00 AM</span></div>
            <div className="mt-3 flex justify-between text-sm"><span>Machine Learning Lab<span className="block text-xs text-muted-foreground">AI Lab 2</span></span><span className="font-semibold">12:00 PM</span></div>
          </div>
        )}
      </div>
      {widgets.includes('exams') && (
        <div className="rounded-[1.5rem] border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 font-semibold"><ClipboardList size={18} className="text-primary" />Upcoming exams</div>
          <div className="mt-3 flex justify-between text-sm"><span>Data Structures<span className="block text-xs text-muted-foreground">Written</span></span><span className="font-semibold">2026-09-03</span></div>
          <div className="mt-3 flex justify-between text-sm"><span>Machine Learning<span className="block text-xs text-muted-foreground">Practical</span></span><span className="font-semibold">2026-09-06</span></div>
        </div>
      )}
      {widgets.includes('announcements') && (
        <div className="rounded-[1.5rem] border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 font-semibold"><Megaphone size={18} className="text-primary" />Announcements</div>
          <p className="mt-3 text-sm text-muted-foreground">Mid-semester examination timetable has been published.</p>
          <p className="mt-2 text-sm text-muted-foreground">Career readiness workshop registrations close Friday.</p>
        </div>
      )}
      {widgets.includes('deadlines') && (
        <div className="rounded-[1.5rem] border bg-card p-5 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Important deadline</p>
          <p className="mt-3 font-semibold">Compiler lab record submission</p>
          <p className="mt-1 text-sm text-muted-foreground">Due August 26, 2026</p>
        </div>
      )}
    </section>
  );
}
