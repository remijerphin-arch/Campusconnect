'use client';

import { AlertTriangle, Mail, Phone } from 'lucide-react';
import { FACULTY_STUDENTS } from '@/lib/facultyMockData';

export default function StudentList() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Students</p>
      <h2 className="mt-2 text-2xl font-bold">Class overview</h2>
      <div className="mt-6 space-y-4">
        {FACULTY_STUDENTS.map((student) => (
          <div key={student.id} className="rounded-[1.5rem] border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mail size={14} />
                  {student.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone size={14} />
                  {student.phone}
                </span>
                <span className="font-medium text-foreground">CGPA {student.cgpa}</span>
                <span className="font-medium text-foreground">
                  Attendance {student.overallAttendance}%
                </span>
              </div>
            </div>
            {student.overallAttendance < 75 && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                <AlertTriangle size={14} />
                Needs attendance follow-up
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
