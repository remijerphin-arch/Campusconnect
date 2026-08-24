'use client';

import { useEffect, useState } from 'react';
import { ClipboardCheck, FilePenLine } from 'lucide-react';
import { readAttendanceOverrides, readMarksOverrides } from '@/lib/demoStore';
import type { MarksEntry, StudentAttendanceRow } from '@/lib/facultyMockData';

export default function FacultyUpdatesPanel() {
  const [attendance, setAttendance] = useState<Record<string, StudentAttendanceRow[]>>({});
  const [marks, setMarks] = useState<Record<string, MarksEntry[]>>({});

  useEffect(() => {
    const refresh = () => {
      setAttendance(readAttendanceOverrides());
      setMarks(readMarksOverrides());
    };
    refresh();
    window.addEventListener('campusconnect-data-updated', refresh);
    return () => window.removeEventListener('campusconnect-data-updated', refresh);
  }, []);

  const attendanceUpdates = Object.entries(attendance);
  const marksUpdates = Object.entries(marks);

  if (!attendanceUpdates.length && !marksUpdates.length) return null;

  return (
    <section className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Faculty updates</p>
      <h2 className="mt-2 text-2xl font-bold">Latest academic records</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {attendanceUpdates.map(([subjectId, rows]) => (
          <div key={subjectId} className="rounded-[1.25rem] border bg-card p-4">
            <div className="flex items-center gap-2 font-semibold"><ClipboardCheck size={17} className="text-primary" />Attendance updated</div>
            <p className="mt-2 text-sm text-muted-foreground">{subjectId === 'sub-1' ? 'Machine Learning' : 'Compiler Design'}</p>
            <p className="mt-2 text-sm">{rows.filter((row) => row.status === 'present').length} present, {rows.filter((row) => row.status === 'late').length} late, {rows.filter((row) => row.status === 'absent').length} absent</p>
          </div>
        ))}
        {marksUpdates.map(([subjectId, rows]) => (
          <div key={subjectId} className="rounded-[1.25rem] border bg-card p-4">
            <div className="flex items-center gap-2 font-semibold"><FilePenLine size={17} className="text-primary" />Marks updated</div>
            <p className="mt-2 text-sm text-muted-foreground">{subjectId === 'sub-1' ? 'Machine Learning' : 'Compiler Design'}</p>
            <p className="mt-2 text-sm">{rows.length} student records updated by faculty</p>
          </div>
        ))}
      </div>
    </section>
  );
}
