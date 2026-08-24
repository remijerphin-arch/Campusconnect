'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell, Check, Menu, PanelLeft, Search } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import ThemeToggle from '@/components/ThemeToggle';
import BackButton from '@/components/BackButton';

interface TopbarProps {
  currentPath: string;
  onMenuClick: () => void;
  onCollapseToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Topbar({
  currentPath,
  onMenuClick,
  onCollapseToggle,
  sidebarCollapsed,
}: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const unreadCount = MOCK_NOTIFICATIONS.filter((item) => !readNotifications.includes(item.id)).length;

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <BackButton />
          <ThemeToggle />
          <button type="button" className="lg:hidden" onClick={onMenuClick}>
            <Menu size={20} />
          </button>
          <button type="button" className="hidden lg:block" onClick={onCollapseToggle}>
            <PanelLeft size={20} className={sidebarCollapsed ? '-scale-x-100' : ''} />
          </button>
          <button type="button" onClick={() => setSearchOpen((open) => !open)} className="hidden items-center gap-2 rounded-full border bg-card px-4 py-2 text-left sm:flex">
            <Search size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search drives, subjects, updates</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {currentPath === '/student-dashboard' && (
            <Link
              href="/placement-opportunities"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:inline-flex"
            >
              Explore drives
            </Link>
          )}
          <div className="relative">
            <button type="button" onClick={() => setNotificationsOpen((open) => !open)} title="Open notifications" className="relative rounded-full border bg-card p-2">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">{unreadCount}</span>}
            </button>
            {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border bg-card p-4 shadow-card"><div className="flex items-center justify-between"><p className="font-semibold">Notifications</p><button type="button" onClick={() => setReadNotifications(MOCK_NOTIFICATIONS.map((item) => item.id))} className="text-xs font-semibold text-primary">Mark all read</button></div><div className="mt-3 space-y-2">{MOCK_NOTIFICATIONS.map((item) => <button key={item.id} type="button" onClick={() => setReadNotifications((current) => [...new Set([...current, item.id])])} className={`flex w-full gap-2 rounded-xl p-3 text-left text-sm ${readNotifications.includes(item.id) ? 'opacity-50' : 'bg-muted/60'}`}><Check size={15} className="mt-0.5 shrink-0 text-success" /><span><span className="block font-semibold">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.body}</span></span></button>)}</div></div>}
          </div>
        </div>
      </div>
      {searchOpen && <div className="absolute left-4 top-16 z-50 w-[min(420px,calc(100vw-2rem))] rounded-2xl border bg-card p-4 shadow-card"><div className="flex items-center gap-2 rounded-xl border px-3 py-2"><Search size={16} className="text-muted-foreground" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search drives, subjects, updates" className="w-full bg-transparent text-sm outline-none" /></div><div className="mt-3 space-y-2 text-sm">{[['/placement-opportunities', 'Placement opportunities', 'drives companies jobs'], ['/academics', 'Academic subjects and marks', 'subjects marks results'], ['/student-services', 'Campus services and updates', 'attendance timetable assignments events'], ['/lost-found', 'Lost & Found', 'lost found items claims']].filter(([, label, terms]) => !searchQuery || `${label} ${terms}`.toLowerCase().includes(searchQuery.toLowerCase())).map(([href, label]) => <Link key={href} href={href} onClick={() => setSearchOpen(false)} className="block rounded-xl p-3 hover:bg-muted">{label}</Link>)}{searchQuery && !['placement opportunities drives companies jobs', 'academic subjects and marks subjects marks results', 'campus services and updates attendance timetable assignments events', 'lost found lost found items claims'].some((terms) => terms.includes(searchQuery.toLowerCase())) && <p className="p-3 text-sm text-muted-foreground">No authorized results found.</p>}</div></div>}
    </header>
  );
}
