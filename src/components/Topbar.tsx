'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Check, LogOut, Menu, PanelLeft, Search } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import BackButton from '@/components/BackButton';
import { markCampusUpdatesRead, readCampusUpdateReadIds, readCampusUpdates, type CampusUpdate } from '@/lib/demoStore';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';
import { getActiveStudentPortalData } from '@/lib/studentPortalData';

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
  const [campusUpdates, setCampusUpdates] = useState<CampusUpdate[]>([]);
  const [updatesPopupOpen, setUpdatesPopupOpen] = useState(false);
  const [readUpdateIds, setReadUpdateIds] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [studentNotifications, setStudentNotifications] = useState<Array<{ id: string; title: string; body: string; unread: boolean }>>([]);
  const notificationKey = currentRole ?? 'guest';

  useEffect(() => {
    const role = window.localStorage.getItem('campusconnect-demo-role') as UserRole | null;
    const email = window.localStorage.getItem('campusconnect-demo-email') ?? '';
    setCurrentRole(role);
    setCurrentEmail(email);

    if (role === 'student') {
      const nextData = getActiveStudentPortalData(email);
      setStudentNotifications(nextData.notifications.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        unread: Boolean(item.unread),
      })));
    } else {
      setStudentNotifications([]);
    }

    const loadUpdates = () => {
      const next = readCampusUpdates();
      const readIds = readCampusUpdateReadIds(role ?? 'guest');
      setCampusUpdates(next);
      setReadUpdateIds(readIds);
      if (role && next.some((update) => update.roles.includes(role) && !readIds.includes(update.id))) {
        setUpdatesPopupOpen(true);
      }
    };
    loadUpdates();
    window.addEventListener('campusconnect-data-updated', loadUpdates);
    return () => window.removeEventListener('campusconnect-data-updated', loadUpdates);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const relevantUpdates = campusUpdates.filter((update) => {
    if (!currentRole || !update.roles.includes(currentRole)) return false;
    if (update.targetEmail && update.targetEmail.toLowerCase() !== currentEmail) return false;
    if (currentRole === 'student') {
      return update.title === 'Profile edit approved' || update.title.startsWith('Leave request');
    }
    return true;
  });

  const unreadUpdates = relevantUpdates.filter((update) => !readUpdateIds.includes(update.id));
  const notificationFeed = currentRole === 'student' ? studentNotifications : [];
  const unreadCount = notificationFeed.filter((item) => item.unread && !readNotifications.includes(item.id)).length + unreadUpdates.length;

  const markUpdatesRead = () => {
    const ids = relevantUpdates.map((update) => update.id);
    setReadUpdateIds(ids);
    markCampusUpdatesRead(notificationKey, ids);
    setUpdatesPopupOpen(false);
  };

  const markAllRead = () => {
    setReadNotifications(notificationFeed.map((item) => item.id));
    markUpdatesRead();
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.localStorage.removeItem('campusconnect-demo-role');
    window.localStorage.removeItem('campusconnect-demo-email');
    window.location.href = '/';
  };

  return (
    <header className="app-topbar fixed inset-x-0 top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <BackButton />
          <ThemeToggle />
          <button type="button" onClick={onMenuClick} aria-label="Open sidebar" title="Open sidebar">
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
            <Link href="/placement-opportunities" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:inline-flex">Explore drives</Link>
          )}
          {currentRole !== 'campus_admin' && (
            <div className="relative">
              <button type="button" onClick={() => setNotificationsOpen((open) => !open)} title="Open notifications" className="relative rounded-full border bg-card p-2">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">{unreadCount}</span>}
              </button>
              {notificationsOpen && (
                <div className="app-popover absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between"><p className="font-semibold">Notifications</p><button type="button" onClick={markAllRead} className="text-xs font-semibold text-primary">Mark all read</button></div>
                  <div className="mt-3 max-h-[min(28rem,calc(100vh-8rem))] space-y-2 overflow-y-auto">
                    {[...relevantUpdates.map((item) => ({ id: item.id, title: item.title, body: item.body, update: true, unread: !readUpdateIds.includes(item.id) })), ...notificationFeed.map((item) => ({ id: item.id, title: item.title, body: item.body, update: false, unread: item.unread }))].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.update) {
                            markUpdatesRead();
                            return;
                          }
                          setReadNotifications((current) => [...new Set([...current, item.id])]);
                        }}
                        className={`flex w-full gap-2 rounded-xl p-3 text-left text-sm ${((item.update && readUpdateIds.includes(item.id)) || (!item.update && (readNotifications.includes(item.id) || !item.unread))) ? 'opacity-50' : 'bg-muted/60'}`}
                      >
                        <Check size={15} className="mt-0.5 shrink-0 text-success" />
                        <span><span className="block font-semibold">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.body}</span></span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <button type="button" onClick={handleLogout} title="Log out" className="inline-flex items-center gap-2 rounded-full border border-danger/20 bg-danger/5 px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-white">
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
      {updatesPopupOpen && unreadUpdates.length > 0 && (
        <div className="fixed right-4 top-24 z-50 w-[min(28rem,calc(100vw-2rem))] max-w-full">
          <section className="app-popover max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[2rem] border bg-card p-5 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.65)] sm:p-6">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">CampusConnect updates</p>
                <h2 className="mt-2 text-2xl font-bold">Recent updates for you</h2>
                <p className="mt-2 text-sm text-muted-foreground">Important updates from your campus team.</p>
              </div>
              <Bell className="shrink-0 text-primary" size={22} />
            </div>
            <div className="mt-5 space-y-3">
              {unreadUpdates.slice(0, 6).map((update) => (
                <div key={update.id} className="rounded-2xl border bg-muted/40 p-4">
                  <p className="font-semibold leading-6">{update.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{update.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={markUpdatesRead} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Continue to CampusConnect</button>
          </section>
        </div>
      )}
      {searchOpen && <div className="app-overlay fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)}><div className="app-search-dialog absolute left-4 top-20 z-50 w-[min(32rem,calc(100vw-2rem))] rounded-2xl border bg-card p-4 shadow-2xl sm:left-1/2 sm:-translate-x-1/2"><div className="flex items-center gap-2 rounded-xl border px-3 py-2"><Search size={16} className="text-muted-foreground" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search drives, subjects, updates" className="w-full bg-transparent text-sm outline-none" /></div><p className="mt-2 text-xs text-muted-foreground">Press Esc to close</p><div className="mt-3 space-y-2 text-sm">{[['/placement-opportunities', 'Placement opportunities', 'drives companies jobs'], ['/academics', 'Academic subjects and marks', 'subjects marks results'], ['/student-services', 'Campus services and updates', 'attendance timetable assignments events'], ['/lost-found', 'Lost & Found', 'lost found items claims']].filter(([, label, terms]) => !searchQuery || `${label} ${terms}`.toLowerCase().includes(searchQuery.toLowerCase())).map(([href, label]) => <Link key={href} href={href} onClick={() => setSearchOpen(false)} className="block rounded-xl p-3 hover:bg-muted">{label}</Link>)}{searchQuery && !['placement opportunities drives companies jobs', 'academic subjects and marks subjects marks results', 'campus services and updates attendance timetable assignments events', 'lost found lost found items claims'].some((terms) => terms.includes(searchQuery.toLowerCase())) && <p className="p-3 text-sm text-muted-foreground">No authorized results found.</p>}</div></div></div>}
    </header>
  );
}
