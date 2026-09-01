import AppLayout from '@/components/AppLayout';
import CanteenManagementPanel from '@/app/campus-admin/components/CanteenManagementPanel';

export default function CampusAdminCanteenPage() {
  return (
    <AppLayout currentPath="/campus-admin/canteen">
      <CanteenManagementPanel />
    </AppLayout>
  );
}
