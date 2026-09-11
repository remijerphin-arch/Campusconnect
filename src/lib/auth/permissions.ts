import type { UserRole } from '@/types';

/**
 * Every fine-grained action a role can be granted in CampusConnect,
 * written as `<module>.<action>`. Add new capabilities here first,
 * then grant them to the relevant role(s) in `defaultPermissions` below.
 */
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

/**
 * The permission set each role starts with out of the box.
 * campus_admin is intentionally granted everything; the other roles
 * only get what they need for their own workspace.
 */
const defaultPermissions: Record<UserRole, readonly Permission[]> = {
  // Students can only view their own records and manage Lost & Found reports.
  student: ['attendance.view', 'marks.view', 'placements.view', 'lost_found.view', 'lost_found.create'],
  // Faculty can fully manage attendance and marks, but not placements or admin settings.
  faculty: [
    'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.delete',
    'marks.view', 'marks.create', 'marks.edit', 'marks.delete', 'lost_found.view',
  ],
  // Placement admins own the placements module end to end.
  placement_admin: ['placements.view', 'placements.create', 'placements.edit', 'placements.delete', 'lost_found.view'],
  // Campus admins get the full permission list, including user and settings management.
  campus_admin: [
    'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.delete',
    'marks.view', 'marks.create', 'marks.edit', 'marks.delete', 'placements.view',
    'placements.create', 'placements.edit', 'placements.delete', 'lost_found.view',
    'lost_found.create', 'lost_found.moderate', 'users.view', 'users.create', 'users.edit',
    'users.delete', 'settings.manage', 'audit_logs.view',
  ],
};

/** Returns whether a role has been granted a specific permission. */
export function hasPermission(role: UserRole, permission: Permission) {
  return defaultPermissions[role].includes(permission);
}

/** Returns a copy of the full permission list for a role. */
export function getDefaultPermissions(role: UserRole) {
  return [...defaultPermissions[role]];
}

/**
 * Route-level access control used by middleware.ts.
 * This is coarser than the Permission list above — it just decides
 * whether a role is allowed to load a given page at all.
 */
export function canAccessPath(role: UserRole, pathname: string) {
  // The forbidden page itself must always be reachable, or a blocked
  // redirect would loop forever.
  if (pathname === '/forbidden') return true;
  // Campus admins can reach every route.
  if (role === 'campus_admin') return true;
  if (role === 'student') return pathname === '/student-dashboard' || pathname === '/student-profile' || pathname === '/academics' || pathname === '/student-services' || pathname === '/placement-opportunities' || pathname === '/lost-found' || pathname === '/canteen';
  if (role === 'faculty') return pathname === '/faculty-dashboard' || pathname === '/lost-found' || pathname === '/canteen';
  if (role === 'placement_admin') return pathname === '/placement-admin';
  // Any other role/path combination is denied by default.
  return false;
}
