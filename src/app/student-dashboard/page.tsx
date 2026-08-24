import AppLayout from '@/components/AppLayout';
import AttendanceSection from '@/app/student-dashboard/components/AttendanceSection';
import DashboardBentoGrid from '@/app/student-dashboard/components/DashboardBentoGrid';
import NotificationsPanel from '@/app/student-dashboard/components/NotificationsPanel';
import PlacementPipelineSection from '@/app/student-dashboard/components/PlacementPipelineSection';
import UpcomingDeadlines from '@/app/student-dashboard/components/UpcomingDeadlines';
import FacultyUpdatesPanel from '@/app/student-dashboard/components/FacultyUpdatesPanel';
import StudentHomeOverview from '@/app/student-dashboard/components/StudentHomeOverview';

export default function StudentDashboardPage() {
  return (
    <AppLayout currentPath="/student-dashboard">
      <div className="space-y-6">
        <StudentHomeOverview />
        <DashboardBentoGrid />
        <AttendanceSection />
        <FacultyUpdatesPanel />
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <PlacementPipelineSection />
            <UpcomingDeadlines />
          </div>
          <NotificationsPanel />
        </div>
      </div>
    </AppLayout>
  );
}
