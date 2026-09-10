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

/**
 * Interface for sidebar navigation props and mobile drawer handlers.
 */
interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const studentNavigation = [
  { href: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/student-profile', label: 'My Profile', icon: Users },
  { href: '/academics', label: 'Academics', icon: BookOpen },
  { href: '/student-services', label: 'Campus Services', icon: CalendarCheck },
  { href: '/canteen', label: 'Canteen', icon: ChefHat },
  { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
  { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
] as const;

const adminNavigation = [
  { href: '/campus-admin', label: 'Campus Control Center', icon: Shield },
  { href: '/campus-admin/canteen', label: 'Canteen Management', icon: ChefHat },
  { href: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
  { href: '/student-services', label: 'Student Services', icon: CalendarCheck },
  { href: '/student-profile', label: 'Student Profile', icon: Users },
  { href: '/faculty-dashboard', label: 'Faculty Services', icon: BookOpen },
  { href: '/placement-admin', label: 'Placement Services', icon: Building2 },
  { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  { href: '/lost-found', label: 'Lost & Found Moderation', icon: SearchCheck },
] as const;

const navItemsByPath = {
  '/student-dashboard': studentNavigation,
  '/faculty-dashboard': [
    { href: '/faculty-dashboard', label: 'Faculty Workspace', icon: BookOpen },
    { href: '/canteen', label: 'Canteen', icon: ChefHat },
    { href: '/lost-found', label: 'Lost & Found', icon: SearchCheck },
  ],
  '/placement-admin': [
    { href: '/placement-admin', label: 'Placement Administration', icon: Building2 },
  ],
  '/placement-opportunities': [
    ...studentNavigation,
  ],
  '/student-profile': [
    ...studentNavigation.filter((item) => !['/student-services', '/lost-found'].includes(item.href)),
  ],
  '/academics': [
    ...studentNavigation.filter((item) => !['/student-services', '/lost-found'].includes(item.href)),
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
    ...adminNavigation,
  ],
  '/campus-admin/canteen': [
    ...adminNavigation,
  ],
} as const;

const workspaceSummary = {
  '/student-dashboard': {
    title: 'Student Companion Portal',
    description: 'Track academic progress, attendance percentages, placement drives, canteen orders, and campus notices in real time.',
    status: 'Student Workspace',
  },
  '/faculty-dashboard': {
    title: 'Faculty Teaching Hub',
    description: 'Manage class rosters, mark date-wise attendance, record CIA internal scores, review low-attendance alerts, and export reports.',
    status: 'Faculty Workspace',
  },
  '/placement-admin': {
    title: 'Placement Administration Desk',
    description: 'Coordinate recruitment drives, corporate partners, eligibility cutoffs, candidate shortlisting, and selection statistics.',
    status: 'Placement Admin',
  },
  '/placement-opportunities': {
    title: 'Placement Drive Opportunities',
    description: 'Discover active campus recruitment drives, review CTC packages, eligibility criteria, and submit applications.',
    status: 'Student Workspace',
  },
  '/campus-admin': {
    title: 'Campus Operating System Admin',
    description: 'Configure platform modules, toggle service availability, manage user roles, audit activity logs, and monitor campus health.',
    status: 'System Admin',
  },
  '/student-profile': {
    title: 'Digital Student Profile',
    description: 'Manage verified personal information, academic credentials, skills inventory, certifications, and portfolio links.',
    status: 'Student Workspace',
  },
  '/academics': {
    title: 'Academic Record & Marks',
    description: 'Review course-wise internal marks, practical scores, semester CGPA trends, attendance charts, and print official PDF transcripts.',
    status: 'Student Workspace',
  },
  '/student-services': {
    title: 'Student Services Companion',
    description: 'Access class timetables, hall tickets, assignment submissions, digital library resources, club events, and help desk tickets.',
    status: 'Student Workspace',
  },
  '/canteen': {
    title: 'Campus Canteen Pre-order Hub',
    description: 'Browse daily South Canteen food menus, select pickup time slots, reserve meals, and avoid cafeteria queues.',
    status: 'Student Workspace',
  },
  '/campus-admin/canteen': {
    title: 'Canteen Operations Manager',
    description: 'Update daily food menu items, manage item availability, set meal timings, and publish daily canteen schedules.',
    status: 'System Admin',
  },
  '/lost-found': {
    title: 'Campus Lost & Found Desk',
    description: 'Report misplaced items, search verified lost property records, submit claim verifications, and track recovery status.',
    status: 'Campus Community',
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
