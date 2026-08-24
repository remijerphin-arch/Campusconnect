'use client';

import { CheckCircle2, Clock3, FileSearch, XCircle } from 'lucide-react';
import { MOCK_PLACEMENT_OPPORTUNITIES } from '@/lib/mockData';

const stageStyles = {
  open: { label: 'Open', icon: Clock3, color: 'text-accent' },
  applied: { label: 'Applied', icon: FileSearch, color: 'text-primary' },
  shortlisted: { label: 'Shortlisted', icon: CheckCircle2, color: 'text-success' },
  closed: { label: 'Closed', icon: XCircle, color: 'text-danger' },
};

export default function PlacementPipelineSection() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Placement pipeline
      </p>
      <h2 className="mt-2 text-2xl font-bold">Application progress</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {MOCK_PLACEMENT_OPPORTUNITIES.map((opportunity) => {
          const cfg = stageStyles[opportunity.status];
          const Icon = cfg.icon;
          return (
            <div key={opportunity.id} className="rounded-[1.5rem] border p-5">
              <div className={`flex items-center gap-2 text-sm font-semibold ${cfg.color}`}>
                <Icon size={16} />
                {cfg.label}
              </div>
              <p className="mt-4 text-lg font-bold">{opportunity.company}</p>
              <p className="text-sm text-muted-foreground">{opportunity.title}</p>
              <p className="mt-3 text-sm">Deadline: {opportunity.deadline}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
