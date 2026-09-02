'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import PageTransition from '@/components/PageTransition';
import { isRoleAccessEnabled } from '@/lib/adminAccess';
import { readAdminSettings } from '@/lib/demoStore';
import type { UserRole } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

const rolePaths = {
  student: ['/student-dashboard', '/student-profile', '/academics', '/student-services', '/placement-opportunities', '/lost-found', '/canteen'],
  faculty: ['/faculty-dashboard', '/lost-found', '/canteen'],
  placement_admin: ['/placement-admin'],
  campus_admin: ['/campus-admin', '/campus-admin/canteen', '/student-dashboard', '/student-profile', '/academics', '/student-services', '/placement-opportunities', '/lost-found', '/faculty-dashboard', '/placement-admin', '/canteen'],
} as const;

export default function AppLayout({ children, currentPath }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    const role = window.localStorage.getItem('campusconnect-demo-role') as UserRole | null;
    const settings = readAdminSettings();

    if (settings?.maintenanceMode && role !== 'campus_admin') {
      window.location.href = '/';
      return;
    }

    if (!role || !rolePaths[role].includes(currentPath as never) || !isRoleAccessEnabled(role, settings)) {
      window.location.href = role && !isRoleAccessEnabled(role, settings) ? '/forbidden' : '/';
      return;
    }
    setAccessChecked(true);
  }, [currentPath]);

  if (!accessChecked) return null;

  return (
    <div className="app-shell min-h-screen bg-transparent">
      <Sidebar
        collapsed={sidebarCollapsed}
        currentPath={currentPath}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className={sidebarOpen ? (sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72') : ''}>
        <Topbar
          currentPath={currentPath}
          onMenuClick={() => setSidebarOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed((value) => !value)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="px-4 pb-8 pt-24 sm:px-6 lg:px-8"><PageTransition key={currentPath}>{children}</PageTransition></main>
      </div>
    </div>
  );
}
