'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, GraduationCap } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import AttendanceBarChart from '@/app/student-dashboard/components/AttendanceBarChart';
import { MOCK_ATTENDANCE, MOCK_CGPA_TREND, MOCK_MARKS } from '@/lib/mockData';
import { readAttendanceOverrides, readMarksOverrides } from '@/lib/demoStore';
import type { MarksEntry, StudentAttendanceRow } from '@/lib/facultyMockData';

export default function AcademicsPage() {
  const [marks, setMarks] = useState(MOCK_MARKS);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  useEffect(() => {
    const refresh = () => {
      const markOverrides = readMarksOverrides();
      const attendanceOverrides = readAttendanceOverrides();
      if (Object.keys(markOverrides).length) {
        setMarks(Object.values(markOverrides).flat().map((item: MarksEntry) => ({
          subject: item.name,
          internal1: item.internal1,
          internal2: item.internal2,
          internal3: item.internal3,
          practical: item.practical,
        })));
      }
      if (Object.keys(attendanceOverrides).length) {
        setAttendance(Object.values(attendanceOverrides).map((rows: StudentAttendanceRow[]) => ({
          subject: 'Faculty-updated subject', attended: rows.filter((row) => row.status === 'present').length,
          total: rows.length, percentage: Math.round((rows.filter((row) => row.status === 'present').length / rows.length) * 100),
          status: 'safe' as const, source: 'manual' as const,
        })));
      }
    };
    refresh();
    window.addEventListener('campusconnect-data-updated', refresh);
    return () => window.removeEventListener('campusconnect-data-updated', refresh);
  }, []);
  const downloadReport = () => window.print();
  return <AppLayout currentPath="/academics"><div className="mx-auto max-w-6xl space-y-6"><section className="flex flex-col justify-between gap-4 rounded-[2rem] border bg-card p-6 shadow-card sm:flex-row sm:items-start"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Academic module</p><h1 className="mt-2 text-3xl font-bold">Your academic record</h1><p className="mt-2 text-sm text-muted-foreground">Review marks, attendance, semester results, and performance trends in one place.</p></div><button type="button" onClick={downloadReport} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Download size={16} /> Download report</button></section><section className="grid gap-4 sm:grid-cols-3"><div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><GraduationCap size={20} className="text-primary" /><p className="mt-4 text-sm text-muted-foreground">Current CGPA</p><p className="mt-1 text-3xl font-bold">8.72</p></div><div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><FileText size={20} className="text-primary" /><p className="mt-4 text-sm text-muted-foreground">Latest SGPA</p><p className="mt-1 text-3xl font-bold">8.72</p></div><div className="rounded-[1.5rem] border bg-card p-5 shadow-card"><p className="text-sm text-muted-foreground">Attendance percentage</p><p className="mt-4 text-3xl font-bold">83%</p><p className="mt-1 text-sm text-success">Good standing</p></div></section><section className="rounded-[2rem] border bg-card p-6 shadow-card"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Performance trend</p><h2 className="mt-2 text-2xl font-bold">Semester CGPA</h2><div className="mt-5 h-72"><div className="flex h-full items-end gap-4">{MOCK_CGPA_TREND.map((item) => <div key={item.semester} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold">{item.cgpa}</span><div className="w-full rounded-t-xl bg-primary/80" style={{ height: `${(item.cgpa / 10) * 100}%` }} /><span className="text-xs text-muted-foreground">{item.semester.replace('Sem ', 'S')}</span></div>)}</div></div></section><div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><section className="rounded-[2rem] border bg-card p-6 shadow-card"><h2 className="text-2xl font-bold">Subject marks</h2><div className="mt-5 overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-muted-foreground"><th className="pb-3">Subject</th><th className="pb-3">Internal 1</th><th className="pb-3">Internal 2</th><th className="pb-3">Internal 3</th><th className="pb-3">Practical</th></tr></thead><tbody>{marks.map((mark) => <tr key={mark.subject} className="border-t"><td className="py-3 font-medium">{mark.subject}</td><td className="py-3">{mark.internal1}</td><td className="py-3">{mark.internal2}</td><td className="py-3">{mark.internal3 ?? '-'}</td><td className="py-3">{mark.practical ?? '-'}</td></tr>)}</tbody></table></div></section><section className="rounded-[2rem] border bg-card p-6 shadow-card"><h2 className="text-2xl font-bold">Attendance by subject</h2><div className="mt-4"><AttendanceBarChart /></div><div className="mt-4 space-y-2">{attendance.map((item) => <div key={item.subject} className="flex justify-between border-b py-2 text-sm"><span>{item.subject}</span><span className="font-semibold">{item.percentage}%</span></div>)}</div></section></div><p className="hidden print:block">CampusConnect academic report generated for student record review.</p></div></AppLayout>;
}
