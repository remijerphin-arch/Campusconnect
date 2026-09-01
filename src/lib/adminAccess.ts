import type { AdminSettings } from '@/lib/demoStore';
import type { UserRole } from '@/types';

export const roleAccessLabels: Record<UserRole, string> = {
  student: 'Student portal',
  faculty: 'Faculty workspace',
  placement_admin: 'Placement services',
  campus_admin: 'Campus admin',
};

const roleServiceMap: Record<UserRole, keyof AdminSettings['services']> = {
  student: 'studentPortal',
  faculty: 'facultyWorkspace',
  placement_admin: 'placementServices',
  campus_admin: 'studentPortal',
};

export function isRoleAccessEnabled(role: UserRole, settings: AdminSettings | null | undefined) {
  if (!settings) return true;
  if (role === 'campus_admin') return true;

  return settings.services[roleServiceMap[role]] !== false;
}

export function isUploadSourceAllowed(role: UserRole, source: string) {
  const lower = source.toLowerCase();
  if (role === 'student' || role === 'faculty') {
    return lower === 'xlsx' || lower === 'xls' || lower === 'csv' || lower === 'pdf';
  }

  if (role === 'placement_admin') {
    return lower === 'xlsx' || lower === 'xls' || lower === 'csv';
  }

  return false;
}

export function getDefaultRosterEntry(role: UserRole) {
  return role === 'student'
    ? {
        name: '',
        email: '',
        role: 'student' as const,
        department: '',
        rollNumber: '',
        semester: 1,
        batch: '',
      }
    : {
        name: '',
        email: '',
        role: role === 'faculty' ? 'faculty' : ('placement_admin' as const),
        department: '',
        employeeId: '',
      };
}
