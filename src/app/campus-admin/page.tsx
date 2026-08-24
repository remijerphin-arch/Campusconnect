import AppLayout from '@/components/AppLayout';
import CampusAdminConsole from '@/app/campus-admin/components/CampusAdminConsole';
import CustomizationCenter from '@/app/campus-admin/components/CustomizationCenter';

export default function CampusAdminPage() {
  return (
    <AppLayout currentPath="/campus-admin">
      <CampusAdminConsole />
      <CustomizationCenter />
    </AppLayout>
  );
}
