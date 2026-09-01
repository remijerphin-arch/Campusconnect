'use client';

import {
  ArrowUpRight,
  Briefcase,
  CreditCard,
  GraduationCap,
  SearchCheck,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_COMMUNITY_BOARD, MOCK_DASHBOARD_STATS } from '@/lib/mockData';
import CGPATrendChart from '@/app/student-dashboard/components/CGPATrendChart';

export default function DashboardBentoGrid() {
  const stats = [
    { label: 'Attendance', value: `${MOCK_DASHBOARD_STATS.attendancePct}%`, Icon: CreditCard },
    { label: 'Applications', value: `${MOCK_DASHBOARD_STATS.activeApplications}`, Icon: Briefcase },
    { label: 'Shortlisted', value: `${MOCK_DASHBOARD_STATS.shortlistedCount}`, Icon: GraduationCap },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[2rem] border bg-card p-6 shadow-card lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Academic trend
            </p>
            <h2 className="mt-2 text-2xl font-bold">Performance snapshot</h2>
          </div>
          <div className="rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
            CGPA {MOCK_DASHBOARD_STATS.currentCgpa}
          </div>
        </div>
        <CGPATrendChart />
      </div>

      <div className="grid gap-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-[1.5rem] border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon size={18} className="text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border bg-card p-6 shadow-card lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Community services
            </p>
            <h2 className="mt-2 text-2xl font-bold">Lost-and-found and resource exchange</h2>
          </div>
          <Link
            href="/lost-found"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          >
            Explore more
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {MOCK_COMMUNITY_BOARD.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border bg-muted/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {item.category === 'lost_found' ? (
                    <SearchCheck size={18} className="text-accent" />
                  ) : (
                    <Share2 size={18} className="text-success" />
                  )}
                  <p className="font-semibold">{item.title}</p>
                </div>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
              <p className="mt-3 text-sm font-medium">{item.owner}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
