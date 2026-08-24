'use client';

import { ADMIN_DRIVES } from '@/lib/placementAdminData';

export default function OpportunityLifecycle() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Drive flow</p>
      <h2 className="mt-2 text-2xl font-bold">Placement lifecycle</h2>
      <div className="mt-6 space-y-4">
        {ADMIN_DRIVES.map((drive) => (
          <div key={drive.id} className="rounded-[1.5rem] border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{drive.company}</p>
                <p className="text-sm text-muted-foreground">{drive.role}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
                {drive.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
              <span>CTC {drive.ctcLpa} LPA</span>
              <span>CGPA {drive.minCgpa}+</span>
              <span>{drive.allowedBacklogs} backlogs max</span>
              <span>{drive.applicants} applicants</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
