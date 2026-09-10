/**
 * Data structures and types for placement drives, candidate applications, and company records.
 */
export type DriveStatus =
  | 'upcoming'
  | 'active'
  | 'shortlisting'
  | 'interview'
  | 'completed'
  | 'cancelled';

export type ApplicationStatus =
  | 'not_applied'
  | 'applied'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected';

export interface Company {
  id: string;
  name: string;
  industry: string;
  sector: 'product' | 'service' | 'core' | 'consulting';
  contact: string;
  email: string;
  openings: number;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  company: string;
  role: string;
  ctcLpa: number;
  deadline: string;
  status: DriveStatus;
  minCgpa: number;
  allowedBacklogs: number;
  applicants: number;
}

export interface CandidateApplication {
  id: string;
  studentName: string;
  rollNumber: string;
  driveId: string;
  driveName: string;
  cgpa: number;
  backlogCount: number;
  status: ApplicationStatus;
}

export const ADMIN_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Infosphere Labs',
    industry: 'Enterprise Software & AI',
    sector: 'product',
    contact: 'Aparna Rao',
    email: 'hiring@infosphere.ai',
    openings: 18,
  },
  {
    id: 'company-2',
    name: 'Northpeak Analytics',
    industry: 'Data & Financial Insights',
    sector: 'service',
    contact: 'Nikhil Varma',
    email: 'campus@northpeak.com',
    openings: 12,
  },
  {
    id: 'company-3',
    name: 'Aether Cloud Solutions',
    industry: 'Cloud Infrastructure & DevOps',
    sector: 'product',
    contact: 'Rohit Kulkarni',
    email: 'university@aethercloud.io',
    openings: 25,
  },
  {
    id: 'company-4',
    name: 'CyberShield Systems',
    industry: 'Cybersecurity & Auditing',
    sector: 'consulting',
    contact: 'Meera Iyer',
    email: 'careers@cybershield.net',
    openings: 10,
  },
];

export const ADMIN_DRIVES: PlacementDrive[] = [
  {
    id: 'drive-1',
    companyId: 'company-1',
    company: 'Infosphere Labs',
    role: 'Software Engineer - Backend & Systems',
    ctcLpa: 12,
    deadline: '2026-08-28',
    status: 'active',
    minCgpa: 7.5,
    allowedBacklogs: 0,
    applicants: 145,
  },
  {
    id: 'drive-2',
    companyId: 'company-2',
    company: 'Northpeak Analytics',
    role: 'Data Analyst & BI Specialist',
    ctcLpa: 4.8,
    deadline: '2026-08-25',
    status: 'interview',
    minCgpa: 7,
    allowedBacklogs: 1,
    applicants: 82,
  },
  {
    id: 'drive-3',
    companyId: 'company-3',
    company: 'Aether Cloud Solutions',
    role: 'Cloud Operations & DevOps Engineer',
    ctcLpa: 9.5,
    deadline: '2026-09-05',
    status: 'upcoming',
    minCgpa: 7.2,
    allowedBacklogs: 0,
    applicants: 98,
  },
  {
    id: 'drive-4',
    companyId: 'company-4',
    company: 'CyberShield Systems',
    role: 'Security Analyst Trainee',
    ctcLpa: 8.0,
    deadline: '2026-09-12',
    status: 'upcoming',
    minCgpa: 7.0,
    allowedBacklogs: 0,
    applicants: 64,
  },
];

export const CANDIDATE_POOL: CandidateApplication[] = [
  {
    id: 'cand-1',
    studentName: 'Arjun Sharma',
    rollNumber: '21CS047',
    driveId: 'drive-1',
    driveName: 'Infosphere Labs',
    cgpa: 8.72,
    backlogCount: 0,
    status: 'applied',
  },
  {
    id: 'cand-2',
    studentName: 'Diya Reddy',
    rollNumber: '21CS024',
    driveId: 'drive-2',
    driveName: 'Northpeak Analytics',
    cgpa: 8.4,
    backlogCount: 0,
    status: 'shortlisted',
  },
  {
    id: 'cand-3',
    studentName: 'Karan Patel',
    rollNumber: '21CS037',
    driveId: 'drive-1',
    driveName: 'Infosphere Labs',
    cgpa: 7.1,
    backlogCount: 1,
    status: 'rejected',
  },
];

export const PLACEMENT_SUMMARY = {
  companies: ADMIN_COMPANIES.length,
  activeDrives: ADMIN_DRIVES.filter((drive) => drive.status === 'active').length,
  interviews: ADMIN_DRIVES.filter((drive) => drive.status === 'interview').length,
  candidates: CANDIDATE_POOL.length,
};
