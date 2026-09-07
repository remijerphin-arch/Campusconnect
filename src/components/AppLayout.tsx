'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CalendarDays, LayoutDashboard, UserRound } from 'lucide-react';
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
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

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
    setCurrentRole(role);
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
        <main className="px-4 pb-28 pt-24 sm:px-6 lg:pb-8 lg:px-8"><PageTransition key={currentPath}>{children}</PageTransition></main>
      </div>
      {currentRole === 'student' && (
        <nav className="app-mobile-nav fixed bottom-4 left-4 right-4 z-30 flex items-center justify-around rounded-[1.45rem] border p-2 shadow-2xl lg:hidden" aria-label="Primary navigation">
          {[
            { href: '/student-dashboard', label: 'Home', Icon: LayoutDashboard },
            { href: '/academics', label: 'Academics', Icon: BookOpen },
            { href: '/student-services', label: 'Campus', Icon: CalendarDays },
            { href: '/student-profile', label: 'Profile', Icon: UserRound },
          ].map(({ href, label, Icon }) => (
            <Link key={href} href={href} aria-current={currentPath === href ? 'page' : undefined} className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-semibold transition ${currentPath === href ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'text-muted-foreground'}`}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
