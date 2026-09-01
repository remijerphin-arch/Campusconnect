'use client';

import { useMemo, useState } from 'react';
import { Search, UserRound } from 'lucide-react';
import { FACULTY_STUDENTS } from '@/lib/facultyMockData';
import { readImportedUsers } from '@/lib/demoStore';

export default function StudentDirectory() {
  const [query, setQuery] = useState('');
  const students = useMemo(() => {
    const imported = readImportedUsers()
      .filter((user) => user.roleKey === 'student')
      .map((user, index) => ({
        id: `imported-${index}`,
        name: user.name,
        rollNumber: user.rollNumber ?? 'Not provided',
        email: user.email,
        phone: 'Not provided',
        cgpa: 0,
        overallAttendance: 0,
        department: user.department ?? 'Not provided',
        semester: 'Not provided',
      }));
    return [...FACULTY_STUDENTS.map((student) => ({ ...student, department: 'Computer Science and Engineering', semester: '7' })), ...imported];
  }, []);
  const matches = students.filter((student) => `${student.name} ${student.rollNumber} ${student.email}`.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Faculty directory</p>
          <h2 className="mt-2 text-2xl font-bold">Search student details</h2>
          <p className="mt-2 text-sm text-muted-foreground">Search by student name, register number, or email.</p>
        </div>
        <UserRound className="text-primary" size={22} />
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-xl border bg-background px-3 py-2">
        <Search size={17} className="text-muted-foreground" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter name or register number" className="w-full bg-transparent text-sm outline-none" />
      </div>
      <div className="mt-5 space-y-3">
        {matches.map((student) => (
          <div key={student.id} className="rounded-2xl border p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">Register number: {student.rollNumber}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Student record</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <p><span className="text-muted-foreground">Email:</span> {student.email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {student.phone}</p>
              <p><span className="text-muted-foreground">Department:</span> {student.department}</p>
              <p><span className="text-muted-foreground">Semester:</span> {student.semester}</p>
              <p><span className="text-muted-foreground">CGPA:</span> {student.cgpa || 'Not available'}</p>
              <p><span className="text-muted-foreground">Attendance:</span> {student.overallAttendance ? `${student.overallAttendance}%` : 'Not available'}</p>
            </div>
          </div>
        ))}
        {!matches.length && <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">No student matched that search.</p>}
      </div>
    </section>
  );
}
