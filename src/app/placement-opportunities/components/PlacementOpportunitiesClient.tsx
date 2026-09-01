'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import EligibilityDrawer from '@/app/placement-opportunities/components/EligibilityDrawer';
import OpportunityCard from '@/app/placement-opportunities/components/OpportunityCard';
import PlacementStatsBar from '@/app/placement-opportunities/components/PlacementStatsBar';
import { MOCK_PLACEMENT_OPPORTUNITIES } from '@/lib/mockData';
import type { PlacementOpportunity } from '@/types';

export default function PlacementOpportunitiesClient() {
  const [query, setQuery] = useState('');
  const [activeOpportunity, setActiveOpportunity] = useState<PlacementOpportunity | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return MOCK_PLACEMENT_OPPORTUNITIES.filter((item) => item.status === 'applied').map((item) => item.id);
    const stored = window.localStorage.getItem('campusconnect-placement-applications');
    return stored ? JSON.parse(stored) : MOCK_PLACEMENT_OPPORTUNITIES.filter((item) => item.status === 'applied').map((item) => item.id);
  });

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return MOCK_PLACEMENT_OPPORTUNITIES.filter((item) =>
      `${item.company} ${item.title} ${item.location}`.toLowerCase().includes(lowered)
    );
  }, [query]);

  const handleApply = (opportunity: PlacementOpportunity) => {
    if (opportunity.eligibilityStatus !== 'eligible' || appliedIds.includes(opportunity.id)) return;
    setAppliedIds((current) =>
      current.includes(opportunity.id) ? current : [...current, opportunity.id]
    );
    const next = [...appliedIds, opportunity.id];
    window.localStorage.setItem('campusconnect-placement-applications', JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Placement opportunities
        </p>
        <h1 className="mt-2 text-3xl font-bold">Find roles that match your profile</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Students can review eligibility, apply for available roles, and track upcoming deadlines in one place.
        </p>
        <div className="mt-5 flex items-center gap-3 rounded-full border bg-background px-4 py-3">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by company, role, or location"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <PlacementStatsBar />

      <div className="grid gap-5 xl:grid-cols-2">
        {filtered.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onInspect={setActiveOpportunity}
            onApply={handleApply}
            applied={appliedIds.includes(opportunity.id)}
          />
        ))}
      </div>

      {activeOpportunity ? (
        <EligibilityDrawer
          opportunity={activeOpportunity}
          onClose={() => setActiveOpportunity(null)}
        />
      ) : null}
    </div>
  );
}
