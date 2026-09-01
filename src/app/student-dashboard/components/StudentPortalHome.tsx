'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, ChartColumn, CheckCircle2, Clock3, FileText, GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
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

export default function StudentPortalHome() {
  const [data, setData] = useState(() => getActiveStudentPortalData());

  useEffect(() => {
    const email = window.localStorage.getItem('campusconnect-demo-email');
    setData(getActiveStudentPortalData(email ?? undefined));
  }, []);

  const student = data.student;
  const overviewCards = useMemo(() => data.overviewCards, [data]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Student portal overview</p>
            <h1 className="mt-2 text-3xl font-bold">Good Morning, {student.name.split(' ')[0]} 👋</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1.5">Semester {data.summary.semesterLabel.split(' ')[1]}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">{student.program}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">Section {student.section}</span>
              <span className="rounded-full bg-muted px-3 py-1.5">{student.registerNumber}</span>
            </div>
          </div>
          <div className="rounded-[1.5rem] border bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Next class</p>
            <p className="mt-2 font-semibold">{data.todaysClasses[0]?.subject}</p>
            <p className="text-sm text-muted-foreground">{data.todaysClasses[0]?.time}</p>
          </div>
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
              <div key={`${lesson.subject}-${index}`} className="rounded-[1.3rem] border bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{lesson.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{lesson.time}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{lesson.type}</span>
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
