'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, CalendarDays, ChartColumn, CheckCircle2, Clock3, FileText, GraduationCap, Sparkles, TrendingUp, ClipboardList } from 'lucide-react';
import { getActiveStudentPortalData } from '@/lib/studentPortalData';

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(value * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{current.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}{suffix}</span>;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading student dashboard" aria-busy="true">
      <div className="dashboard-skeleton h-48 rounded-[2rem]" />
      <div className="grid gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="dashboard-skeleton h-24 rounded-[1.5rem]" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="dashboard-skeleton h-80 rounded-[2rem]" />
        <div className="dashboard-skeleton h-80 rounded-[2rem]" />
      </div>
    </div>
  );
}

export default function StudentPortalHome() {
  const [data, setData] = useState(() => getActiveStudentPortalData());
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const email = window.localStorage.getItem('campusconnect-demo-email');
    setData(getActiveStudentPortalData(email ?? undefined));
    setIsHydrating(false);
  }, []);

  const student = data.student;
  const overviewCards = useMemo(() => data.overviewCards, [data]);

  if (isHydrating) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <section className="student-hero relative overflow-hidden rounded-[2rem] border p-6 shadow-card">
        <div className="student-hero-orb student-hero-orb-one" />
        <div className="student-hero-orb student-hero-orb-two" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">Campus Connect · Student home</p>
            <h1 className="mt-2 text-3xl font-bold">Good Morning, {student.name.split(' ')[0]} 👋</h1>
            <p className="mt-3 text-sm text-white/70">Here&apos;s what&apos;s happening on campus today.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full bg-muted px-3 py-1.5">Semester {data.summary.semesterLabel.split(' ')[1]}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">{student.program}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">Section {student.section}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">{student.registerNumber}</span>
            </div>
          </div>
          <div className="relative rounded-[1.5rem] border border-white/15 bg-black/20 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Next class</p>
            <p className="mt-2 font-semibold">{data.todaysClasses[0]?.subject}</p>
            <p className="text-sm text-muted-foreground">{data.todaysClasses[0]?.time}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">All features</p><h2 className="mt-1 text-xl font-bold">Your campus, at a glance</h2></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: '/academics', label: 'Academics', Icon: GraduationCap },
            { href: '/student-services', label: 'Campus services', Icon: CalendarDays },
            { href: '/placement-opportunities', label: 'Placements', Icon: TrendingUp },
            { href: '/lost-found', label: 'Lost & Found', Icon: FileText },
          ].map(({ href, label, Icon }) => <Link key={href} href={href} className="feature-launch-card group rounded-[1.35rem] border p-4"><span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon size={18} /></span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs text-muted-foreground">Open section</span></Link>)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {overviewCards.map((card) => (
          <div key={card.label} className="rounded-[1.5rem] border bg-card p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{card.label}</p>
            <p className="mt-3 text-3xl font-bold">
              {card.label === 'CGPA' || card.label === 'Current Semester GPA' ? <CountUp value={Number(card.value)} /> : card.value}
              {card.label === 'CGPA' || card.label === 'Current Semester GPA' ? '' : ''}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{card.subtext}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Today&apos;s overview</p>
              <h2 className="mt-2 text-2xl font-bold">Today&apos;s classes</h2>
            </div>
            <Sparkles className="text-primary" size={18} />
          </div>
          <div className="mt-5 space-y-3">
            {data.todaysClasses.map((lesson: { subject: string; time: string; room: string; faculty: string; type: string }, index: number) => (
              <div key={`${lesson.subject}-${index}`} className={`rounded-[1.3rem] border bg-muted/40 p-4 ${index === 0 ? 'student-next-class' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{lesson.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{lesson.time}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{index === 0 ? 'Next up' : lesson.type}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> Room: {lesson.room}</span>
                  <span className="inline-flex items-center gap-1"><GraduationCap size={14} /> {lesson.faculty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={18} />
            <h2 className="text-xl font-bold">New notifications</h2>
          </div>
          <div className="mt-5 space-y-3">
            {data.notifications.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border bg-muted/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  {item.unread && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">This week</p>
              <h2 className="mt-2 text-2xl font-bold">Class timetable</h2>
            </div>
            <CalendarDays className="text-primary" size={20} />
          </div>
          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[36rem] space-y-2">
              {data.timetable.map((lesson) => (
                <div key={`${lesson.day}-${lesson.time}-${lesson.subject}`} className={`grid grid-cols-[5.5rem_7rem_1fr_auto] items-center gap-3 rounded-xl border bg-muted/30 px-3 py-3 text-sm ${lesson === data.timetable[0] ? 'student-next-class' : ''}`}>
                  <span className="font-semibold text-primary">{lesson.day}</span>
                  <span className="text-muted-foreground">{lesson.time}</span>
                  <span><span className="block font-semibold">{lesson.subject}</span><span className="text-xs text-muted-foreground">{lesson.faculty}</span></span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{lesson.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-primary" size={20} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Assessment calendar</p>
              <h2 className="mt-2 text-2xl font-bold">Upcoming exams</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {data.exams.map((exam) => (
              <div key={`${exam.subject}-${exam.date}`} className="rounded-xl border bg-muted/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-semibold">{exam.subject}</p><p className="mt-1 text-sm text-muted-foreground">{exam.type}</p></div>
                  <span className="text-right text-sm font-semibold text-primary">{exam.date}<span className="block text-xs font-normal text-muted-foreground">{exam.slot}</span></span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{exam.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={18} />
            <h2 className="text-xl font-bold">Current attendance</h2>
          </div>
          <div className="mt-5 space-y-4">
            {data.attendance.slice(0, 4).map((row) => (
              <div key={row.subject}>
                <div className="flex justify-between text-sm">
                  <span>{row.subject}</span>
                  <span className="font-semibold">{row.percentage}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${row.percentage}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{row.present}/{row.total} classes</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Clock3 className="text-primary" size={18} />
            <h2 className="text-xl font-bold">Upcoming deadlines</h2>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-[1.2rem] border bg-muted/40 p-3">
              <p className="font-semibold">Compiler Lab Record</p>
              <p className="mt-1 text-muted-foreground">Due Aug 26, 2026</p>
            </div>
            <div className="rounded-[1.2rem] border bg-muted/40 p-3">
              <p className="font-semibold">Placement Resume Review</p>
              <p className="mt-1 text-muted-foreground">Due Sep 02, 2026</p>
            </div>
            <div className="rounded-[1.2rem] border bg-muted/40 p-3">
              <p className="font-semibold">Fee Payment Reminder</p>
              <p className="mt-1 text-muted-foreground">Hostel due Sep 15, 2026</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <ChartColumn className="text-primary" size={18} />
            <h2 className="text-xl font-bold">Semester trends</h2>
          </div>
          <div className="mt-5 space-y-3">
            {data.semesters.map((semester) => (
              <div key={semester.semester}>
                <div className="flex items-center justify-between text-sm">
                  <span>Sem {semester.semester}</span>
                  <span className="font-semibold">{semester.gpa}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-success" style={{ width: `${semester.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
