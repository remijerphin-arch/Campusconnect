import AppLayout from '@/components/AppLayout';
import CanteenPageClient from '@/app/canteen/CanteenPageClient';

export default function CanteenPage() {
  return (
    <AppLayout currentPath="/canteen">
      <CanteenPageClient />
    </AppLayout>
  );
}
