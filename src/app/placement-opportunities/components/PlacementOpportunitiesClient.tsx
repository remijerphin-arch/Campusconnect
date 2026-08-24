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

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    return MOCK_PLACEMENT_OPPORTUNITIES.filter((item) =>
      `${item.company} ${item.title} ${item.location}`.toLowerCase().includes(lowered)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Placement opportunities
        </p>
        <h1 className="mt-2 text-3xl font-bold">Find roles that match your profile</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Students can review eligibility, application status, and upcoming deadlines from one
          cloud-connected placement workspace.
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
