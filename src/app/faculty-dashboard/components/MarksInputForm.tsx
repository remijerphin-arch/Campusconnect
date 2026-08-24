'use client';

import { useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { SUBJECT_MARKS, type MarksEntry } from '@/lib/facultyMockData';
import { readMarksOverrides, saveMarksOverrides } from '@/lib/demoStore';
import { toast } from 'sonner';
import { validators } from '@/lib/validation';

interface MarksInputFormProps {
  subjectId: string;
}

export default function MarksInputForm({ subjectId }: MarksInputFormProps) {
  const [rows, setRows] = useState<MarksEntry[]>(SUBJECT_MARKS[subjectId] ?? []);
  const [assessmentTypes, setAssessmentTypes] = useState(['CIA 1', 'CIA 2', 'Assignment', 'Quiz', 'Mid-sem', 'Practical']);
  const [selectedAssessment, setSelectedAssessment] = useState('CIA 1');
  const [newAssessment, setNewAssessment] = useState('');

  useEffect(() => {
    setRows(readMarksOverrides()[subjectId] ?? SUBJECT_MARKS[subjectId] ?? []);
  }, [subjectId]);

  const updateMark = (studentId: string, field: keyof Pick<MarksEntry, 'internal1' | 'internal2' | 'internal3' | 'practical'>, value: string) => {
    const numericValue = Number(value);
    if (value !== '' && validators.mark(numericValue, 40)) {
      toast.error(validators.mark(numericValue, 40) ?? 'Invalid mark');
      return;
    }
    setRows((current) => current.map((row) => (
      row.studentId === studentId ? { ...row, [field]: value === '' ? null : Number(value) } : row
    )));
  };

  const saveChanges = () => {
    const overrides = readMarksOverrides();
    saveMarksOverrides({ ...overrides, [subjectId]: rows });
    toast.success('Marks saved for students');
  };

  const addAssessmentType = () => {
    const value = newAssessment.trim();
    if (!value || assessmentTypes.includes(value)) return;
    setAssessmentTypes((current) => [...current, value]);
    setNewAssessment('');
  };

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Marks</p>
      <h2 className="mt-2 text-2xl font-bold">Internal assessment entries</h2>
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-muted/50 p-4">
        <label className="text-sm font-medium">Assessment type<select value={selectedAssessment} onChange={(event) => setSelectedAssessment(event.target.value)} className="mt-1 rounded-xl border bg-background px-3 py-2">{assessmentTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="text-sm font-medium">Add custom type<input value={newAssessment} onChange={(event) => setNewAssessment(event.target.value)} placeholder="Internal" className="mt-1 rounded-xl border bg-background px-3 py-2" /></label>
        <button type="button" onClick={addAssessmentType} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Plus size={16} /> Add type</button>
      </div>
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
