'use client';

import { Briefcase, CalendarClock, Check, MapPin, Users } from 'lucide-react';
import type { PlacementOpportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: PlacementOpportunity;
  onInspect: (opportunity: PlacementOpportunity) => void;
  onApply: (opportunity: PlacementOpportunity) => void;
  applied: boolean;
}

export default function OpportunityCard({
  opportunity,
  onInspect,
  onApply,
  applied,
}: OpportunityCardProps) {
  return (
    <div className="rounded-[1.75rem] border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {opportunity.company}
          </p>
          <h3 className="mt-2 text-xl font-bold">{opportunity.title}</h3>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
          {opportunity.type}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{opportunity.description}</p>
      <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <MapPin size={14} />
          {opportunity.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarClock size={14} />
          {opportunity.deadline}
        </span>
        <span className="inline-flex items-center gap-2">
          <Briefcase size={14} />
          {opportunity.packageLpa} LPA
        </span>
        <span className="inline-flex items-center gap-2">
          <Users size={14} />
          {opportunity.applicants} applicants
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {opportunity.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${opportunity.eligibilityStatus === 'eligible' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}
        >
          {opportunity.eligibilityStatus}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onApply(opportunity)}
            disabled={applied || opportunity.eligibilityStatus !== 'eligible'}
            className={`rounded-full px-4 py-2 text-sm font-medium ${applied ? 'bg-success/10 text-success' : opportunity.eligibilityStatus !== 'eligible' ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}
          >
            {applied ? (
              <span className="inline-flex items-center gap-2">
                <Check size={14} /> Applied
              </span>
            ) : (
              opportunity.eligibilityStatus === 'eligible' ? 'Apply now' : 'Not eligible'
            )}
          </button>
          <button
            type="button"
            onClick={() => onInspect(opportunity)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
          >
            View eligibility
          </button>
        </div>
      </div>
    </div>
  );
}
