'use client';

import { X } from 'lucide-react';
import type { PlacementOpportunity } from '@/types';

interface EligibilityDrawerProps {
  opportunity: PlacementOpportunity;
  onClose: () => void;
}

export default function EligibilityDrawer({ opportunity, onClose }: EligibilityDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Eligibility details
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {opportunity.company} · {opportunity.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border p-2">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[1.5rem] border p-5">
            <p className="font-semibold">Minimum CGPA</p>
            <p className="mt-2 text-sm text-muted-foreground">{opportunity.minimumCgpa}</p>
          </div>
          <div className="rounded-[1.5rem] border p-5">
            <p className="font-semibold">Allowed backlogs</p>
            <p className="mt-2 text-sm text-muted-foreground">{opportunity.allowedBacklogs}</p>
          </div>
          <div className="rounded-[1.5rem] border p-5">
            <p className="font-semibold">Required skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {opportunity.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-muted px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border p-5">
            <p className="font-semibold">Requirements</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {opportunity.requirements.map((requirement) => (
                <li key={requirement}>• {requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
