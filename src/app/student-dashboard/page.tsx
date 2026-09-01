import AppLayout from '@/components/AppLayout';
import StudentPortalHome from '@/app/student-dashboard/components/StudentPortalHome';

export default function StudentDashboardPage() {
  return (
    <AppLayout currentPath="/student-dashboard">
      <StudentPortalHome />
    </AppLayout>
  );
}
