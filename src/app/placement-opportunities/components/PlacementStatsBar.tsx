'use client';

import { Briefcase, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { MOCK_PLACEMENT_OPPORTUNITIES } from '@/lib/mockData';

export default function PlacementStatsBar() {
  const eligible = MOCK_PLACEMENT_OPPORTUNITIES.filter(
    (item) => item.eligibilityStatus === 'eligible'
  ).length;
  const applied = MOCK_PLACEMENT_OPPORTUNITIES.filter((item) => item.status === 'applied').length;
  const shortlisted = MOCK_PLACEMENT_OPPORTUNITIES.filter(
    (item) => item.status === 'shortlisted'
  ).length;
  const stats = [
    { label: 'Total opportunities', value: `${MOCK_PLACEMENT_OPPORTUNITIES.length}`, Icon: Briefcase },
    { label: 'Eligible now', value: `${eligible}`, Icon: CheckCircle2 },
    { label: 'Applied', value: `${applied}`, Icon: Clock3 },
    { label: 'Shortlisted', value: `${shortlisted}`, Icon: Sparkles },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {stats.map(({ label, value, Icon }) => (
        <div key={label} className="rounded-[1.5rem] border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon size={18} className="text-primary" />
          </div>
          <p className="mt-4 text-3xl font-bold">{value}</p>
        </div>
      ))}
    </section>
  );
}
