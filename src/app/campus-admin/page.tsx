import { ShieldCheck, Users, Database, Settings2 } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';

const controls = [
  ['User access', 'Manage student, faculty, placement, and admin access.', Users, '/'],
  ['Cloud data', 'Monitor the shared academic and placement data foundation.', Database, '/student-dashboard'],
  ['Role policies', 'Review which workspace each campus role can access.', ShieldCheck, '/faculty-dashboard'],
  ['System settings', 'Configure attendance sync and campus-wide settings.', Settings2, '/placement-admin'],
] as const;

export default function CampusAdminPage() {
  return (
    <AppLayout currentPath="/campus-admin">
      <div className="space-y-6">
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Campus administration
          </p>
          <h1 className="mt-2 text-3xl font-bold">Control center for CampusConnect</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Manage access, cloud operations, role policies, and integrations across the campus platform.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          {controls.map(([title, description, Icon, href]) => (
            <Link key={title} href={href} className="rounded-[1.5rem] border bg-card p-6 shadow-card transition hover:border-primary">
              <Icon size={22} className="text-primary" />
              <h2 className="mt-4 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
