'use client';

import Link from 'next/link';
import { Bell, Menu, PanelLeft, Search } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';

interface TopbarProps {
  onMenuClick: () => void;
  onCollapseToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Topbar({
  onMenuClick,
  onCollapseToggle,
  sidebarCollapsed,
}: TopbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" className="lg:hidden" onClick={onMenuClick}>
            <Menu size={20} />
          </button>
          <button type="button" className="hidden lg:block" onClick={onCollapseToggle}>
            <PanelLeft size={20} className={sidebarCollapsed ? '-scale-x-100' : ''} />
          </button>
          <div className="hidden items-center gap-2 rounded-full border bg-card px-4 py-2 sm:flex">
            <Search size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search drives, subjects, updates</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/placement-opportunities"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:inline-flex"
          >
            Explore drives
          </Link>
          <div className="relative rounded-full border bg-card p-2">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
              {MOCK_NOTIFICATIONS.length}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
