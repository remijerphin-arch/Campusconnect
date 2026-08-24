'use client';

import { CANDIDATE_POOL } from '@/lib/placementAdminData';

export default function CandidatePoolVisibility() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Candidates</p>
      <h2 className="mt-2 text-2xl font-bold">Application pool visibility</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-3">Student</th>
              <th className="pb-3">Drive</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Backlogs</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATE_POOL.map((candidate) => (
              <tr key={candidate.id} className="border-t">
                <td className="py-3">
                  <p className="font-medium">{candidate.studentName}</p>
                  <p className="text-xs text-muted-foreground">{candidate.rollNumber}</p>
                </td>
                <td className="py-3">{candidate.driveName}</td>
                <td className="py-3">{candidate.cgpa}</td>
                <td className="py-3">{candidate.backlogCount}</td>
                <td className="py-3">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
                    {candidate.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
