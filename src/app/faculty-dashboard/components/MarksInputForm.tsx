'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { SUBJECT_MARKS, type MarksEntry } from '@/lib/facultyMockData';
import { readMarksOverrides, saveMarksOverrides } from '@/lib/demoStore';
import { toast } from 'sonner';

interface MarksInputFormProps {
  subjectId: string;
}

export default function MarksInputForm({ subjectId }: MarksInputFormProps) {
  const [rows, setRows] = useState<MarksEntry[]>(SUBJECT_MARKS[subjectId] ?? []);

  useEffect(() => {
    setRows(readMarksOverrides()[subjectId] ?? SUBJECT_MARKS[subjectId] ?? []);
  }, [subjectId]);

  const updateMark = (studentId: string, field: keyof Pick<MarksEntry, 'internal1' | 'internal2' | 'internal3' | 'practical'>, value: string) => {
    setRows((current) => current.map((row) => (
      row.studentId === studentId ? { ...row, [field]: value === '' ? null : Number(value) } : row
    )));
  };

  const saveChanges = () => {
    const overrides = readMarksOverrides();
    saveMarksOverrides({ ...overrides, [subjectId]: rows });
    toast.success('Marks saved for students');
  };

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
                {(['internal1', 'internal2', 'internal3', 'practical'] as const).map((field) => (
                  <td key={field} className="py-3">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={row[field] ?? ''}
                      onChange={(event) => updateMark(row.studentId, field, event.target.value)}
                      className="w-20 rounded-lg border bg-background px-2 py-1"
                    />
                  </td>
                ))}
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
