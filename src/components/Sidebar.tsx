'use client';

import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  Shield,
  Users,
  X,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { href: '/student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
  { href: '/faculty-dashboard', label: 'Faculty Dashboard', icon: BookOpen },
  { href: '/placement-opportunities', label: 'Placement Opportunities', icon: Briefcase },
  { href: '/placement-admin', label: 'Placement Admin', icon: Building2 },
  { href: '/', label: 'Login', icon: Shield },
];

export default function Sidebar({
  collapsed,
  currentPath,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={onMobileClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card/95 backdrop-blur transition-transform duration-200 lg:translate-x-0 ${collapsed ? 'lg:w-24' : ''} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
          <button type="button" className="lg:hidden" onClick={onMobileClose}>
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-5">
          {!collapsed && (
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-4">
              <p className="text-sm font-semibold">Unified campus operations</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Academics, attendance, placements, lost-and-found, and resource exchange.
              </p>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                  <Users size={12} />
                  4 roles
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                  <CalendarCheck size={12} />
                  RFID sync
                </span>
              </div>
            </div>
          )}
          <nav className="mt-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-primary text-primary-foreground shadow-card' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
