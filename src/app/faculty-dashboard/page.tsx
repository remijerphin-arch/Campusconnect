'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AttendanceManager from '@/app/faculty-dashboard/components/AttendanceManager';
import MarksInputForm from '@/app/faculty-dashboard/components/MarksInputForm';
import StudentList from '@/app/faculty-dashboard/components/StudentList';
import SubjectRoster from '@/app/faculty-dashboard/components/SubjectRoster';
import { FACULTY_SUBJECTS, type FacultySubject } from '@/lib/facultyMockData';

export default function FacultyDashboardPage() {
  const [activeSubject, setActiveSubject] = useState<FacultySubject>(FACULTY_SUBJECTS[0]);

  return (
    <AppLayout currentPath="/faculty-dashboard">
      <div className="space-y-6">
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Faculty workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold">Teaching operations in one place</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Manage subject rosters, verify RFID attendance data, and update internal marks
            from the same dashboard.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <SubjectRoster
              activeSubjectId={activeSubject.id}
              onSelectSubject={(subject) => setActiveSubject(subject)}
            />
            <StudentList />
          </div>
          <div className="space-y-6">
            <AttendanceManager subjectId={activeSubject.id} />
            <MarksInputForm subjectId={activeSubject.id} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
