import AppLayout from '@/components/AppLayout';
import CandidatePoolVisibility from '@/app/placement-admin/components/CandidatePoolVisibility';
import CompanyRoster from '@/app/placement-admin/components/CompanyRoster';
import EligibilityCriteriaSetup from '@/app/placement-admin/components/EligibilityCriteriaSetup';
import OpportunityLifecycle from '@/app/placement-admin/components/OpportunityLifecycle';
import { PLACEMENT_SUMMARY } from '@/lib/placementAdminData';
import SmartShortlist from '@/app/placement-admin/components/SmartShortlist';
import DriveManager from '@/app/placement-admin/components/DriveManager';

export default function PlacementAdminPage() {
  return (
    <AppLayout currentPath="/placement-admin">
      <div className="space-y-6">
        <div className="rounded-[2rem] border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Placement administration
          </p>
          <h1 className="mt-2 text-3xl font-bold">Coordinate drives from a single cloud panel</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Manage partner companies, eligibility filters, drive progress, and candidate
            visibility from one centralized workspace.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Companies', PLACEMENT_SUMMARY.companies],
              ['Active drives', PLACEMENT_SUMMARY.activeDrives],
              ['Interview stage', PLACEMENT_SUMMARY.interviews],
              ['Candidates', PLACEMENT_SUMMARY.candidates],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <CompanyRoster />
          <OpportunityLifecycle />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <EligibilityCriteriaSetup />
          <CandidatePoolVisibility />
        </div>
        <SmartShortlist />
        <DriveManager />
      </div>
    </AppLayout>
  );
}
