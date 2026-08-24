'use client';

import { CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { MOCK_ATTENDANCE } from '@/lib/mockData';
import AttendanceBarChart from '@/app/student-dashboard/components/AttendanceBarChart';

export default function AttendanceSection() {
  const riskySubjects = MOCK_ATTENDANCE.filter((item) => item.status !== 'safe');

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Attendance
          </p>
          <h2 className="mt-2 text-2xl font-bold">RFID-backed attendance overview</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Physical entry events can sync into CampusConnect and update student attendance in
            the cloud automatically.
          </p>
        </div>
        <div className="rounded-[1.25rem] border bg-muted px-4 py-3 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <Radio size={16} className="text-success" />
            RFID sync active
          </div>
          <p className="mt-1 text-muted-foreground">Last sync: August 24, 2026 at 09:40 AM</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <AttendanceBarChart />
        <div className="space-y-3">
          {riskySubjects.map((item) => (
            <div key={item.subject} className="rounded-[1.25rem] border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.attended}/{item.total} classes attended
                  </p>
                </div>
                {item.status === 'warning' ? (
                  <AlertTriangle size={18} className="text-warning" />
                ) : (
                  <CheckCircle2 size={18} className="text-danger" />
                )}
              </div>
              <p className="mt-3 text-sm">
                Current attendance: <span className="font-semibold">{item.percentage}%</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
