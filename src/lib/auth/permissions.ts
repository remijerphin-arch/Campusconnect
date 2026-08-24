import type { UserRole } from '@/types';

export type Permission =
  | 'attendance.view'
  | 'attendance.create'
  | 'attendance.edit'
  | 'attendance.delete'
  | 'marks.view'
  | 'marks.create'
  | 'marks.edit'
  | 'marks.delete'
  | 'placements.view'
  | 'placements.create'
  | 'placements.edit'
  | 'placements.delete'
  | 'lost_found.view'
  | 'lost_found.create'
  | 'lost_found.moderate'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'settings.manage'
  | 'audit_logs.view';

const defaultPermissions: Record<UserRole, readonly Permission[]> = {
  student: ['attendance.view', 'marks.view', 'placements.view', 'lost_found.view', 'lost_found.create'],
  faculty: [
    'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.delete',
    'marks.view', 'marks.create', 'marks.edit', 'marks.delete', 'lost_found.view',
  ],
  placement_admin: ['placements.view', 'placements.create', 'placements.edit', 'placements.delete', 'lost_found.view'],
  campus_admin: [
    'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.delete',
    'marks.view', 'marks.create', 'marks.edit', 'marks.delete', 'placements.view',
    'placements.create', 'placements.edit', 'placements.delete', 'lost_found.view',
    'lost_found.create', 'lost_found.moderate', 'users.view', 'users.create', 'users.edit',
    'users.delete', 'settings.manage', 'audit_logs.view',
  ],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return defaultPermissions[role].includes(permission);
}

export function getDefaultPermissions(role: UserRole) {
  return [...defaultPermissions[role]];
}

export function canAccessPath(role: UserRole, pathname: string) {
  if (pathname === '/forbidden') return true;
  if (role === 'campus_admin') return true;
  if (role === 'student') return pathname === '/student-dashboard' || pathname === '/student-profile' || pathname === '/academics' || pathname === '/student-services' || pathname === '/placement-opportunities';
  if (role === 'faculty') return pathname === '/faculty-dashboard';
  if (role === 'placement_admin') return pathname === '/placement-admin';
  return false;
}
