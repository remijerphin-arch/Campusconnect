import type { MarksEntry, StudentAttendanceRow } from '@/lib/facultyMockData';
import type { Company } from '@/lib/placementAdminData';

const ATTENDANCE_KEY = 'campusconnect-attendance-overrides';
const MARKS_KEY = 'campusconnect-marks-overrides';
const COMPANIES_KEY = 'campusconnect-companies';
const ADMIN_SETTINGS_KEY = 'campusconnect-admin-settings';

export interface AdminSettings {
  services: {
    studentPortal: boolean;
    facultyWorkspace: boolean;
    placementServices: boolean;
    communityBoard: boolean;
  };
  rfidEnabled: boolean;
  maintenanceMode: boolean;
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
