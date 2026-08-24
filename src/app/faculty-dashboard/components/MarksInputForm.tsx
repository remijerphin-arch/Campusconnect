'use client';

import { Save } from 'lucide-react';
import { SUBJECT_MARKS } from '@/lib/facultyMockData';

interface MarksInputFormProps {
  subjectId: string;
}

export default function MarksInputForm({ subjectId }: MarksInputFormProps) {
  const rows = SUBJECT_MARKS[subjectId] ?? [];

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Marks</p>
      <h2 className="mt-2 text-2xl font-bold">Internal assessment entries</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-3">Student</th>
              <th className="pb-3">Internal 1</th>
              <th className="pb-3">Internal 2</th>
              <th className="pb-3">Internal 3</th>
              <th className="pb-3">Practical</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId} className="border-t">
                <td className="py-3">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.rollNumber}</p>
                </td>
                <td className="py-3">{row.internal1}</td>
                <td className="py-3">{row.internal2}</td>
                <td className="py-3">{row.internal3 ?? '-'}</td>
                <td className="py-3">{row.practical ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        <Save size={16} />
        Save marks
      </button>
    </section>
  );
}
