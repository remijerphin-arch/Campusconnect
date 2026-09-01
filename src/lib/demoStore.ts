import type { MarksEntry, StudentAttendanceRow } from '@/lib/facultyMockData';
import type { Company } from '@/lib/placementAdminData';
import type { Permission } from '@/lib/auth/permissions';
import type { UserProfile, UserRole } from '@/types';
import { DEMO_CREDENTIALS } from '@/lib/mockData';

const ATTENDANCE_KEY = 'campusconnect-attendance-overrides';
const MARKS_KEY = 'campusconnect-marks-overrides';
const COMPANIES_KEY = 'campusconnect-companies';
const ADMIN_SETTINGS_KEY = 'campusconnect-admin-settings';
const MODULE_SETTINGS_KEY = 'campusconnect-module-settings';
const PERMISSION_SETTINGS_KEY = 'campusconnect-permission-settings';
const IMPORTED_USERS_KEY = 'campusconnect-imported-users';
const PROFILE_IMAGES_KEY = 'campusconnect-profile-images';
const CAMPUS_UPDATES_KEY = 'campusconnect-campus-updates';
const CAMPUS_UPDATE_READ_KEY = 'campusconnect-campus-updates-read';

export interface AdminSettings {
  services: {
    studentPortal: boolean;
    facultyWorkspace: boolean;
    placementServices: boolean;
    communityBoard: boolean;
  };
  rfidEnabled: boolean;
  maintenanceMode: boolean;
  studentWidgets: string[];
}

export function readAttendanceOverrides(): Record<string, StudentAttendanceRow[]> {
  if (typeof window === 'undefined') return {};
  const value = window.localStorage.getItem(ATTENDANCE_KEY);
  return value ? JSON.parse(value) : {};
}

export function saveAttendanceOverrides(value: Record<string, StudentAttendanceRow[]>) {
  window.localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readMarksOverrides(): Record<string, MarksEntry[]> {
  if (typeof window === 'undefined') return {};
  const value = window.localStorage.getItem(MARKS_KEY);
  return value ? JSON.parse(value) : {};
}

export function saveMarksOverrides(value: Record<string, MarksEntry[]>) {
  window.localStorage.setItem(MARKS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readCompanies(): Company[] | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(COMPANIES_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveCompanies(value: Company[]) {
  window.localStorage.setItem(COMPANIES_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readAdminSettings(): AdminSettings | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(ADMIN_SETTINGS_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveAdminSettings(value: AdminSettings) {
  window.localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readModuleSettings(): Record<string, boolean> | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(MODULE_SETTINGS_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveModuleSettings(value: Record<string, boolean>) {
  window.localStorage.setItem(MODULE_SETTINGS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readPermissionSettings(): Record<string, Permission[]> | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(PERMISSION_SETTINGS_KEY);
  return value ? JSON.parse(value) : null;
}

export function savePermissionSettings(value: Record<string, Permission[]>) {
  window.localStorage.setItem(PERMISSION_SETTINGS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export interface ImportedUser {
  label: string;
  roleKey: UserRole;
  name: string;
  email: string;
  password: string;
  department?: string;
  rollNumber?: string;
  employeeId?: string;
  active?: boolean;
}

export function readImportedUsers(): ImportedUser[] {
  if (typeof window === 'undefined') return [];
  const value = window.localStorage.getItem(IMPORTED_USERS_KEY);
  return value ? JSON.parse(value) : [];
}

export function saveImportedUsers(value: ImportedUser[]) {
  window.localStorage.setItem(IMPORTED_USERS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readProfileImages(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const value = window.localStorage.getItem(PROFILE_IMAGES_KEY);
  return value ? JSON.parse(value) : {};
}

export function saveProfileImages(value: Record<string, string>) {
  window.localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export interface CampusUpdate {
  id: string;
  title: string;
  body: string;
  roles: UserRole[];
  targetEmail?: string;
  createdAt: string;
}

export function readCampusUpdates(): CampusUpdate[] {
  if (typeof window === 'undefined') return [];
  const value = window.localStorage.getItem(CAMPUS_UPDATES_KEY);
  return value ? JSON.parse(value) : [];
}

export function publishCampusUpdate(update: Omit<CampusUpdate, 'id' | 'createdAt'>) {
  const next = [{ ...update, id: `update-${Date.now()}`, createdAt: new Date().toISOString() }, ...readCampusUpdates()].slice(0, 50);
  window.localStorage.setItem(CAMPUS_UPDATES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('campusconnect-data-updated'));
}

export function readCampusUpdateReadIds(key: string): string[] {
  if (typeof window === 'undefined') return [];
  const value = window.localStorage.getItem(CAMPUS_UPDATE_READ_KEY);
  const states = value ? JSON.parse(value) as Record<string, string[]> : {};
  return states[key] ?? [];
}

export function markCampusUpdatesRead(key: string, ids: string[]) {
  const value = window.localStorage.getItem(CAMPUS_UPDATE_READ_KEY);
  const states = value ? JSON.parse(value) as Record<string, string[]> : {};
  states[key] = [...new Set(ids)];
  window.localStorage.setItem(CAMPUS_UPDATE_READ_KEY, JSON.stringify(states));
}

export function readAllDemoUsers(): ImportedUser[] {
  const provided = DEMO_CREDENTIALS.map((credential) => ({
    label: credential.label,
    roleKey: credential.roleKey,
    name: credential.name,
    email: credential.email,
    password: credential.password,
    active: true,
  }));

  return [...provided, ...readImportedUsers()];
}

export function getUserRoleFromPath(pathname: string): UserRole | null {
  if (pathname === '/student-dashboard' || pathname === '/student-profile' || pathname === '/academics' || pathname === '/student-services' || pathname === '/placement-opportunities' || pathname === '/lost-found') return 'student';
  if (pathname === '/faculty-dashboard') return 'faculty';
  if (pathname === '/placement-admin') return 'placement_admin';
  if (pathname === '/campus-admin') return 'campus_admin';
  return null;
}
