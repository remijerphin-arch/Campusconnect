import AppLayout from '@/components/AppLayout';
import PlacementOpportunitiesClient from '@/app/placement-opportunities/components/PlacementOpportunitiesClient';

export default function PlacementOpportunitiesPage() {
  return (
    <AppLayout currentPath="/placement-opportunities">
      <PlacementOpportunitiesClient />
    </AppLayout>
  );
}
