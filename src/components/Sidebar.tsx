'use client';

import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ChefHat,
  LayoutDashboard,
  LogOut,
  SearchCheck,
  Shield,
  Users,
  X,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItemsByPath = {
  '/student-dashboard': [
    { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/student-profile', label: 'My Profile', icon: Users },
    { href: '/academics', label: 'Academics', icon: BookOpen },
    { href: '/student-services', label: 'Campus Services', icon: CalendarCheck },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  ],
  '/faculty-dashboard': [
    { href: '/faculty-dashboard', label: 'Faculty Workspace', icon: BookOpen },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
  ],
  '/placement-admin': [
    { href: '/placement-admin', label: 'Placement Administration', icon: Building2 },
  ],
  '/placement-opportunities': [
    { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/student-profile', label: 'My Profile', icon: Users },
    { href: '/academics', label: 'Academics', icon: BookOpen },
    { href: '/student-services', label: 'Campus Services', icon: CalendarCheck },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  ],
  '/student-profile': [
    { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/student-profile', label: 'My Profile', icon: Users },
    { href: '/academics', label: 'Academics', icon: BookOpen },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  ],
  '/academics': [
    { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/student-profile', label: 'My Profile', icon: Users },
    { href: '/academics', label: 'Academics', icon: BookOpen },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  ],
  '/student-services': [
    { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { href: '/student-profile', label: 'My Profile', icon: Users },
    { href: '/academics', label: 'Academics', icon: BookOpen },
    { href: '/student-services', label: 'Campus Services', icon: CalendarCheck },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  ],
  '/campus-admin': [
    { href: '/campus-admin', label: 'Campus Control Center', icon: Shield },
    { href: '/campus-admin/canteen', label: 'Canteen Management', icon: ChefHat },
    { href: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { href: '/student-services', label: 'Student Services', icon: CalendarCheck },
    { href: '/student-profile', label: 'Student Profile', icon: Users },
    { href: '/faculty-dashboard', label: 'Faculty Services', icon: BookOpen },
    { href: '/placement-admin', label: 'Placement Services', icon: Building2 },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
    { href: '/lost-found', label: 'Lost & Found Moderation', icon: SearchCheck },
  ],
  '/campus-admin/canteen': [
    { href: '/campus-admin', label: 'Campus Control Center', icon: Shield },
    { href: '/campus-admin/canteen', label: 'Canteen Management', icon: ChefHat },
    { href: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { href: '/student-services', label: 'Student Services', icon: CalendarCheck },
    { href: '/student-profile', label: 'Student Profile', icon: Users },
    { href: '/faculty-dashboard', label: 'Faculty Services', icon: BookOpen },
    { href: '/placement-admin', label: 'Placement Services', icon: Building2 },
    { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
    { href: '/lost-found', label: 'Lost & Found Moderation', icon: SearchCheck },
  ],
} as const;

const workspaceSummary = {
  '/student-dashboard': {
    title: 'Your campus essentials',
    description: 'Track academics, attendance, placements, and campus community updates.',
    status: 'Student view',
  },
  '/faculty-dashboard': {
    title: 'Teaching operations',
    description: 'Manage rosters, RFID attendance, and internal marks for your subjects.',
    status: 'Faculty view',
  },
  '/placement-admin': {
    title: 'Placement control center',
    description: 'Coordinate companies, eligibility rules, drives, and candidate movement.',
    status: 'Admin view',
  },
  '/placement-opportunities': {
    title: 'Placement discovery',
    description: 'Review open opportunities and track your placement applications.',
    status: 'Student view',
  },
  '/campus-admin': {
    title: 'Campus control center',
    description: 'Manage access, services, integrations, and campus-wide operations.',
    status: 'Admin view',
  },
  '/student-profile': {
    title: 'Student profile',
    description: 'Keep your permitted personal and professional details up to date.',
    status: 'Student view',
  },
  '/academics': {
    title: 'Academic record',
    description: 'Review subjects, marks, attendance, examinations, and performance trends.',
    status: 'Student view',
  },
  '/student-services': {
    title: 'Campus services',
    description: 'Attendance, timetable, assignments, resources, community, events, and support.',
    status: 'Student view',
  },
  '/canteen': {
    title: 'Canteen menu',
    description: 'View the published canteen menu for the current date and compare it to the official board.',
    status: 'Student view',
  },
  '/campus-admin/canteen': {
    title: 'Canteen management',
    description: 'Manage daily menu items, availability, dates, and publishing for campus canteens.',
    status: 'Admin view',
  },
  '/lost-found': {
    title: 'Lost & Found',
    description: 'Report, search, and privately verify campus item claims.',
    status: 'Campus service',
  },
} as const;

export default function Sidebar({
  collapsed,
  currentPath,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const summary = workspaceSummary[currentPath as keyof typeof workspaceSummary];

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.localStorage.removeItem('campusconnect-demo-role');
    window.location.href = '/';
  };

  return (
    <>
      <div
        className={`app-sidebar-backdrop fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={onMobileClose}
      />
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card/95 backdrop-blur transition-transform duration-200 ${collapsed ? 'lg:w-24' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div className="flex items-center gap-3">
            <AppLogo size={40} />
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                  Campus
                </p>
                <p className="text-lg font-bold">Connect</p>
              </div>
            )}
          </div>
          <button type="button" onClick={onMobileClose} aria-label="Close sidebar" title="Close sidebar">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-5">
          {!collapsed && (
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-4">
              <p className="text-sm font-semibold">{summary?.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{summary?.description}</p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                  <Users size={12} />
                  {summary?.status}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                  <CalendarCheck size={12} />
                  RFID sync
                </span>
              </div>
            </div>
          )}
          <nav className="mt-5 space-y-2">
            {(navItemsByPath[currentPath as keyof typeof navItemsByPath] ?? []).map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={`app-sidebar-link group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${active ? 'bg-primary text-primary-foreground shadow-card' : 'text-muted-foreground hover:bg-muted hover:text-foreground'} ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOut size={18} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
