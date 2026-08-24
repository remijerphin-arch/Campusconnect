'use client';

import {
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  SearchCheck,
  Share2,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';

const iconMap = {
  placement: Briefcase,
  academic: BookOpen,
  alert: AlertTriangle,
  general: Bell,
  lost_found: SearchCheck,
  resource: Share2,
};

export default function NotificationsPanel() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <Bell size={18} className="text-primary" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Notifications
          </p>
          <h2 className="mt-1 text-2xl font-bold">Important updates</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {MOCK_NOTIFICATIONS.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div key={notification.id} className="rounded-[1.5rem] border p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{notification.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
