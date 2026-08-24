export type UserRole = 'student' | 'faculty' | 'placement_admin' | 'campus_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  employeeId?: string;
  semester?: number;
  batch?: string;
}

export interface AttendanceRecord {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
  source?: 'manual' | 'rfid';
}

export interface MarksRecord {
  subject: string;
  internal1: number;
  internal2: number;
  internal3: number | null;
  practical: number | null;
}

export interface PlacementOpportunity {
  id: string;
  company: string;
  title: string;
  type: 'Full-time' | 'Internship' | 'PPO';
  location: string;
  packageLpa: number;
  deadline: string;
  applicants: number;
  status: 'open' | 'applied' | 'shortlisted' | 'closed';
  eligibilityStatus: 'eligible' | 'ineligible';
  description: string;
  requirements: string[];
  minimumCgpa: number;
  allowedBacklogs: number;
  skills: string[];
}

export interface EligibilityCheck {
  criterion: string;
  label: string;
  passed: boolean;
  note: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'placement' | 'academic' | 'alert' | 'general' | 'lost_found' | 'resource';
  time: string;
}

export interface AcademicSemester {
  semester: string;
  cgpa: number;
}

export interface DashboardStats {
  currentCgpa: number;
  attendancePct: number;
  activeApplications: number;
  shortlistedCount: number;
}

export interface CommunityBoardItem {
  id: string;
  category: 'lost_found' | 'resource_exchange';
  title: string;
  detail: string;
  owner: string;
  status: string;
}
