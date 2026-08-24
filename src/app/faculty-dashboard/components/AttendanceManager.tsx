'use client';

import { Radio, Save } from 'lucide-react';
import { SUBJECT_ATTENDANCE } from '@/lib/facultyMockData';

interface AttendanceManagerProps {
  subjectId: string;
}

export default function AttendanceManager({ subjectId }: AttendanceManagerProps) {
  const rows = SUBJECT_ATTENDANCE[subjectId] ?? [];

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Attendance manager
          </p>
          <h2 className="mt-2 text-2xl font-bold">Manual review after RFID sync</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            RFID handles primary capture, while faculty can verify late entries and exceptions.
          </p>
        </div>
        <div className="rounded-[1.25rem] border bg-muted px-4 py-3 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <Radio size={16} className="text-success" />
            Last RFID sync completed
          </div>
          <p className="mt-1 text-muted-foreground">August 24, 2026 at 09:40 AM</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.studentId} className="flex items-center justify-between rounded-[1.25rem] border p-4">
            <div>
              <p className="font-semibold">{row.name}</p>
              <p className="text-sm text-muted-foreground">{row.rollNumber}</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
              {row.status}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        <Save size={16} />
        Save attendance changes
      </button>
    </section>
  );
}
