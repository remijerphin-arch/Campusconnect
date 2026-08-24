'use client';

import { CalendarClock } from 'lucide-react';
import { MOCK_UPCOMING_DEADLINES } from '@/lib/mockData';

export default function UpcomingDeadlines() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <CalendarClock size={18} className="text-primary" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Deadlines
          </p>
          <h2 className="mt-1 text-2xl font-bold">What needs attention this week</h2>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {MOCK_UPCOMING_DEADLINES.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-[1.25rem] border p-4">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">{item.due}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
