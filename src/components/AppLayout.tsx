'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

const rolePaths = {
  student: ['/student-dashboard', '/student-profile', '/academics', '/student-services', '/placement-opportunities', '/lost-found'],
  faculty: ['/faculty-dashboard', '/lost-found'],
  placement_admin: ['/placement-admin'],
  campus_admin: ['/campus-admin', '/student-dashboard', '/student-profile', '/academics', '/student-services', '/placement-opportunities', '/faculty-dashboard', '/placement-admin', '/lost-found'],
} as const;

export default function AppLayout({ children, currentPath }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    const role = window.localStorage.getItem('campusconnect-demo-role') as keyof typeof rolePaths | null;
    if (!role || !rolePaths[role].includes(currentPath as never)) {
      window.location.href = '/';
      return;
    }
    setAccessChecked(true);
  }, [currentPath]);

  if (!accessChecked) return null;

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar
        collapsed={sidebarCollapsed}
        currentPath={currentPath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'}>
        <Topbar
          currentPath={currentPath}
          onMenuClick={() => setMobileOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed((value) => !value)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="px-4 pb-8 pt-24 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
