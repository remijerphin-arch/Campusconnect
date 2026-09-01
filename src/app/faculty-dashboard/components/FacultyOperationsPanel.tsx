'use client';

import { useState } from 'react';
import {
  Check,
  ClipboardList,
  Download,
  FilePlus2,
  UserCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { publishCampusUpdate } from '@/lib/demoStore';

const initialLeaves = [
  {
    id: 'leave-1',
    name: 'Diya Reddy',
    dates: 'Aug 28 - Aug 29',
    reason: 'Medical appointment',
    status: 'Pending',
  },
  {
    id: 'leave-2',
    name: 'Karan Patel',
    dates: 'Sep 02',
    reason: 'Family event',
    status: 'Pending',
  },
];

export default function FacultyOperationsPanel() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');

  const updateLeave = (id: string, status: 'Approved' | 'Rejected') => {
    const leave = leaves.find((item) => item.id === id);
    setLeaves((current) =>
      current.map((leave) => (leave.id === id ? { ...leave, status } : leave)),
    );
    publishCampusUpdate({ title: `Leave request ${status.toLowerCase()}`, body: `Your leave request for ${leave?.dates ?? 'the selected dates'} was ${status.toLowerCase()} by faculty.`, roles: ['student'] });
    toast.success(`Leave request ${status.toLowerCase()}`);
  };

  const exportAttendance = () => {
    const csv =
      'Student,Roll Number,Attendance\nAarav Menon,21CS012,88%\nDiya Reddy,21CS024,78%\nKaran Patel,21CS037,69%';
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = 'attendance-report.csv';
    link.click();
    toast.success('Attendance report exported');
  };

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Faculty workflow
            </p>
            <h2 className="mt-2 text-2xl font-bold">Assignments and reports</h2>
          </div>
          <ClipboardList className="text-primary" size={22} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setAssignmentOpen(true)}
            className="flex items-center gap-3 rounded-2xl border p-4 text-left hover:border-primary"
          >
            <FilePlus2 className="text-primary" size={20} />
            <span>
              <span className="block font-semibold">Create assignment</span>
              <span className="text-sm text-muted-foreground">
                Set deadline, section, and file
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={exportAttendance}
            className="flex items-center gap-3 rounded-2xl border p-4 text-left hover:border-primary"
          >
            <Download className="text-primary" size={20} />
            <span>
              <span className="block font-semibold">Export attendance</span>
              <span className="text-sm text-muted-foreground">
                Download a CSV report
              </span>
            </span>
          </button>
        </div>
        {assignmentOpen && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setAssignmentOpen(false);
              toast.success(`${assignmentTitle || 'Assignment'} created`);
              setAssignmentTitle('');
            }}
            className="mt-5 rounded-2xl border bg-muted/50 p-4"
          >
            <div className="flex justify-between">
              <p className="font-semibold">New assignment</p>
              <button type="button" onClick={() => setAssignmentOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <input
              required
              value={assignmentTitle}
              onChange={(event) => setAssignmentTitle(event.target.value)}
              placeholder="Assignment title"
              className="mt-3 w-full rounded-xl border bg-background px-3 py-2"
            />
            <textarea
              placeholder="Description and instructions"
              className="mt-3 min-h-20 w-full rounded-xl border bg-background px-3 py-2"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                required
                type="date"
                className="rounded-xl border bg-background px-3 py-2"
              />
              <select className="rounded-xl border bg-background px-3 py-2">
                <option>Section A</option>
                <option>Section B</option>
              </select>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm">
              <FilePlus2 size={16} /> Attach assignment file
              <input type="file" className="hidden" />
            </label>
            <button
              type="submit"
              className="mt-3 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
            >
              Publish assignment
            </button>
          </form>
        )}
      </div>
      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Leave management
            </p>
            <h2 className="mt-2 text-2xl font-bold">Pending requests</h2>
          </div>
          <UserCheck className="text-primary" size={22} />
        </div>
        <div className="mt-6 space-y-3">
          {leaves.map((leave) => (
            <div key={leave.id} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{leave.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {leave.dates} · {leave.reason}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${leave.status === 'Pending' ? 'bg-warning/10 text-warning' : leave.status === 'Approved' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}
                >
                  {leave.status}
                </span>
              </div>
              {leave.status === 'Pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateLeave(leave.id, 'Approved')}
                    className="inline-flex items-center gap-1 rounded-xl bg-success px-3 py-2 text-sm font-semibold text-success-foreground"
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateLeave(leave.id, 'Rejected')}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-danger"
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
