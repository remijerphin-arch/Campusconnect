'use client';

import { BookOpen, CalendarCheck, Users } from 'lucide-react';
import { FACULTY_SUBJECTS, type FacultySubject } from '@/lib/facultyMockData';

interface SubjectRosterProps {
  activeSubjectId: string;
  onSelectSubject: (subject: FacultySubject) => void;
}

export default function SubjectRoster({
  activeSubjectId,
  onSelectSubject,
}: SubjectRosterProps) {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Subjects</p>
      <h2 className="mt-2 text-2xl font-bold">Faculty subject roster</h2>
      <div className="mt-6 space-y-4">
        {FACULTY_SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            type="button"
            onClick={() => onSelectSubject(subject)}
            className={`w-full rounded-[1.5rem] border p-5 text-left transition ${activeSubjectId === subject.id ? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {subject.code} · {subject.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Semester {subject.semester}</p>
              </div>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold">
                Section {subject.section}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users size={14} />
                {subject.totalStudents} students
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarCheck size={14} />
                {subject.classesHeld} classes
              </span>
              <span className="inline-flex items-center gap-1">
                <BookOpen size={14} />
                {subject.avgAttendance}% average attendance
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
