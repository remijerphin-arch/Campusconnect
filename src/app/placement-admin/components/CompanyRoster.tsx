'use client';

import { Building2, Mail, UserRound } from 'lucide-react';
import { ADMIN_COMPANIES } from '@/lib/placementAdminData';

export default function CompanyRoster() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Companies</p>
      <h2 className="mt-2 text-2xl font-bold">Partner roster</h2>
      <div className="mt-6 space-y-4">
        {ADMIN_COMPANIES.map((company) => (
          <div key={company.id} className="rounded-[1.5rem] border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
                {company.sector}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <UserRound size={14} />
                {company.contact}
              </span>
              <span className="inline-flex items-center gap-1">
                <Mail size={14} />
                {company.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 size={14} />
                {company.openings} openings
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
