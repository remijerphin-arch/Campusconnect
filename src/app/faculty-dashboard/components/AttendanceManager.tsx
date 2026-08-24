'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Radio, Save, UserCheck } from 'lucide-react';
import { SUBJECT_ATTENDANCE, type StudentAttendanceRow } from '@/lib/facultyMockData';
import { readAttendanceOverrides, saveAttendanceOverrides } from '@/lib/demoStore';
import { toast } from 'sonner';
import { validators } from '@/lib/validation';

interface AttendanceManagerProps {
  subjectId: string;
}

export default function AttendanceManager({ subjectId }: AttendanceManagerProps) {
  const [rows, setRows] = useState<StudentAttendanceRow[]>(SUBJECT_ATTENDANCE[subjectId] ?? []);
  const [attendanceDate, setAttendanceDate] = useState('2026-08-24');

  useEffect(() => {
    setRows(readAttendanceOverrides()[subjectId] ?? SUBJECT_ATTENDANCE[subjectId] ?? []);
  }, [subjectId]);

  const updateStatus = (studentId: string, status: StudentAttendanceRow['status']) => {
    setRows((current) => current.map((row) => (row.studentId === studentId ? { ...row, status } : row)));
  };

  const saveChanges = () => {
    if (!attendanceDate || validators.dateRange(attendanceDate, attendanceDate)) {
      toast.error('Choose a valid attendance date');
      return;
    }
    const overrides = readAttendanceOverrides();
    saveAttendanceOverrides({ ...overrides, [subjectId]: rows });
    toast.success('Attendance changes saved for students');
  };

  const lowAttendance = useMemo(() => rows.filter((row) => row.status === 'absent'), [rows]);
  const markAllPresent = () => setRows((current) => current.map((row) => ({ ...row, status: 'present' })));
  const exportAttendance = () => {
    const csv = ['Student,Roll Number,Date,Status', ...rows.map((row) => `${row.name},${row.rollNumber},${attendanceDate},${row.status}`)].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `${subjectId}-attendance-${attendanceDate}.csv`;
    link.click();
    toast.success('Attendance history exported');
  };

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
        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-muted/50 p-4">
          <label className="text-sm font-medium">Attendance date<input type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} className="mt-1 rounded-xl border bg-background px-3 py-2" /></label>
          <button type="button" onClick={markAllPresent} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><UserCheck size={16} /> Mark all present</button>
          <button type="button" onClick={exportAttendance} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Download size={16} /> Export history</button>
        </div>
        {rows.map((row) => (
          <div key={row.studentId} className="flex items-center justify-between rounded-[1.25rem] border p-4">
            <div>
              <p className="font-semibold">{row.name}</p>
              <p className="text-sm text-muted-foreground">{row.rollNumber}</p>
            </div>
            <select
              value={row.status}
              onChange={(event) => updateStatus(row.studentId, event.target.value as StudentAttendanceRow['status'])}
              className="rounded-xl border bg-background px-3 py-2 text-sm font-medium capitalize"
            >
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        ))}
      </div>
      {lowAttendance.length > 0 && <p className="mt-4 rounded-xl bg-danger/10 p-3 text-sm font-medium text-danger">Low attendance review: {lowAttendance.map((row) => row.name).join(', ')}</p>}
      <button
        type="button"
        onClick={saveChanges}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        <Save size={16} />
        Save attendance changes
      </button>
    </section>
  );
}
