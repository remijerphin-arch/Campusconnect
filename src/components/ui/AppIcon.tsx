'use client';

import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  Search,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

const iconMap = {
  award: Award,
  bell: Bell,
  bookOpen: BookOpen,
  briefcase: Briefcase,
  building2: Building2,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  checkCircle2: CheckCircle2,
  graduationCap: GraduationCap,
  layoutDashboard: LayoutDashboard,
  search: Search,
  settings: Settings,
  shield: Shield,
  trendingUp: TrendingUp,
  userCheck: UserCheck,
  users: Users,
};

type IconName = keyof typeof iconMap;

interface AppIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function AppIcon({ name, className, size = 18 }: AppIconProps) {
  const Icon = (iconMap[name] ?? Shield) as LucideIcon;
  return <Icon className={className} size={size} />;
}
