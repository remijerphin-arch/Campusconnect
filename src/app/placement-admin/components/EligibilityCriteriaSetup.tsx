'use client';

import { Settings2 } from 'lucide-react';
import { ADMIN_DRIVES } from '@/lib/placementAdminData';

export default function EligibilityCriteriaSetup() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Settings2 size={18} className="text-primary" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Eligibility
          </p>
          <h2 className="mt-1 text-2xl font-bold">Drive criteria overview</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ADMIN_DRIVES.map((drive) => (
          <div key={drive.id} className="rounded-[1.5rem] border p-5">
            <p className="font-semibold">{drive.company}</p>
            <p className="mt-2 text-sm text-muted-foreground">{drive.role}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p>Minimum CGPA: {drive.minCgpa}</p>
              <p>Allowed backlogs: {drive.allowedBacklogs}</p>
              <p>Deadline: {drive.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
