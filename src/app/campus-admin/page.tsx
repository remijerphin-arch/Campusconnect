import AppLayout from '@/components/AppLayout';
import CampusAdminConsole from '@/app/campus-admin/components/CampusAdminConsole';

export default function CampusAdminPage() {
  return (
    <AppLayout currentPath="/campus-admin">
      <CampusAdminConsole />
    </AppLayout>
  );
}
