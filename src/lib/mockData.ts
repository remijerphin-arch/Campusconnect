import type {
  AcademicSemester,
  AttendanceRecord,
  CommunityBoardItem,
  DashboardStats,
  MarksRecord,
  Notification,
  PlacementOpportunity,
  UserProfile,
} from '@/types';

export const MOCK_STUDENT: UserProfile = {
  id: 'student-2021-cs-047',
  email: 'arjun.sharma@campusconnect.edu',
  name: 'Arjun Sharma',
  role: 'student',
  department: 'Computer Science and Engineering',
  rollNumber: '21CS047',
  semester: 7,
  batch: '2021-2027',
};

export const MOCK_STUDENT_DETAILS = {
  ...MOCK_STUDENT,
  phone: '+91 9876543210',
  program: 'B.Tech Computer Science and Engineering',
  section: 'A',
  academicYear: '2026-27',
  dateOfBirth: '2004-06-18',
  address: '12 Lake View Road, Bengaluru',
  emergencyContact: '+91 9876501234',
  skills: ['TypeScript', 'Python', 'SQL'],
  certifications: ['AWS Cloud Practitioner', 'Google Data Analytics'],
  languages: ['English', 'Hindi', 'Malayalam'],
  achievements: ['Hackathon finalist 2025', 'Department merit award'],
  projects: ['CampusConnect', 'RFID Attendance Monitor'],
  linkedin: 'linkedin.com/in/arjun-sharma',
  github: 'github.com/arjun-sharma',
  portfolio: 'arjunsharma.dev',
  resume: 'arjun-sharma-resume.pdf',
};

export const MOCK_UPCOMING_CLASSES = [
  { id: 'class-1', subject: 'Machine Learning', faculty: 'Dr. Meera Nair', time: '10:00 AM', room: 'Lab 3' },
  { id: 'class-2', subject: 'Compiler Design', faculty: 'Prof. R. Iyer', time: '1:30 PM', room: 'Room 204' },
];

export const MOCK_UPCOMING_EXAMS = [
  { id: 'exam-1', subject: 'Compiler Design', date: '2026-09-04', mode: 'Written' },
  { id: 'exam-2', subject: 'Machine Learning', date: '2026-09-08', mode: 'Practical' },
];

export const MOCK_FACULTY: UserProfile = {
  id: 'faculty-cse-112',
  email: 'dr.meera@campusconnect.edu',
  name: 'Dr. Meera Nair',
  role: 'faculty',
  department: 'Computer Science and Engineering',
  employeeId: 'FAC112',
};

export const MOCK_PLACEMENT_ADMIN: UserProfile = {
  id: 'placement-04',
  email: 'placement.office@campusconnect.edu',
  name: 'Placement Cell',
  role: 'placement_admin',
  department: 'Training and Placements',
  employeeId: 'PLC004',
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  currentCgpa: 8.72,
  attendancePct: 83,
  activeApplications: 6,
  shortlistedCount: 2,
};

export const MOCK_CGPA_TREND: AcademicSemester[] = [
  { semester: 'Sem 1', cgpa: 8.1 },
  { semester: 'Sem 2', cgpa: 8.3 },
  { semester: 'Sem 3', cgpa: 8.45 },
  { semester: 'Sem 4', cgpa: 8.52 },
  { semester: 'Sem 5', cgpa: 8.61 },
  { semester: 'Sem 6', cgpa: 8.72 },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { subject: 'Operating Systems', attended: 32, total: 38, percentage: 84, status: 'safe', source: 'rfid' },
  { subject: 'Computer Networks', attended: 27, total: 36, percentage: 75, status: 'warning', source: 'rfid' },
  { subject: 'Compiler Design', attended: 31, total: 35, percentage: 89, status: 'safe', source: 'manual' },
  { subject: 'Machine Learning', attended: 23, total: 34, percentage: 68, status: 'danger', source: 'rfid' },
];

export const MOCK_MARKS: MarksRecord[] = [
  { subject: 'Operating Systems', internal1: 34, internal2: 35, internal3: 36, practical: null },
  { subject: 'Computer Networks', internal1: 31, internal2: 33, internal3: null, practical: null },
  { subject: 'Compiler Design', internal1: 36, internal2: 37, internal3: null, practical: 22 },
];

export const MOCK_PLACEMENT_OPPORTUNITIES: PlacementOpportunity[] = [
  {
    id: 'opp-1',
    company: 'Infosphere Labs',
    title: 'Software Engineer',
    type: 'Full-time',
    location: 'Bengaluru',
    packageLpa: 12,
    deadline: '2026-08-28',
    applicants: 145,
    status: 'applied',
    eligibilityStatus: 'eligible',
    description: 'Backend-heavy full-time role with platform engineering exposure.',
    requirements: ['Strong DS&A', 'Java or TypeScript', 'SQL basics'],
    minimumCgpa: 7.5,
    allowedBacklogs: 0,
    skills: ['Java', 'Spring', 'APIs'],
  },
  {
    id: 'opp-2',
    company: 'Northpeak Analytics',
    title: 'Data Analyst Intern',
    type: 'Internship',
    location: 'Hyderabad',
    packageLpa: 4.8,
    deadline: '2026-08-25',
    applicants: 82,
    status: 'shortlisted',
    eligibilityStatus: 'eligible',
    description: 'Six-month internship focused on BI dashboards and SQL workflows.',
    requirements: ['SQL', 'Statistics fundamentals', 'Excel or Python'],
    minimumCgpa: 7,
    allowedBacklogs: 1,
    skills: ['SQL', 'Power BI', 'Python'],
  },
  {
    id: 'opp-3',
    company: 'VoltEdge Mobility',
    title: 'Graduate Engineer Trainee',
    type: 'PPO',
    location: 'Pune',
    packageLpa: 8.5,
    deadline: '2026-09-02',
    applicants: 61,
    status: 'open',
    eligibilityStatus: 'ineligible',
    description: 'Cross-functional engineering role for students from core and CS streams.',
    requirements: ['No active backlogs', 'CGPA 8.0+', 'Communication skills'],
    minimumCgpa: 8,
    allowedBacklogs: 0,
    skills: ['Problem Solving', 'Presentation'],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Shortlisted for Northpeak',
    body: 'Interview slots are available on August 25, 2026. Confirm from the placement panel.',
    type: 'placement',
    time: '1h ago',
  },
  {
    id: 'notif-2',
    title: 'RFID attendance updated',
    body: 'Today’s Machine Learning lab entry has synced automatically from the RFID gate reader.',
    type: 'academic',
    time: '2h ago',
  },
  {
    id: 'notif-3',
    title: 'Lost item reported',
    body: 'A black calculator was reported near Block B and tagged in lost-and-found.',
    type: 'lost_found',
    time: '4h ago',
  },
];

export const MOCK_UPCOMING_DEADLINES = [
  { id: 'deadline-1', title: 'Infosphere application closes', type: 'placement', due: '2026-08-28' },
  { id: 'deadline-2', title: 'Compiler lab record submission', type: 'academic', due: '2026-08-26' },
  { id: 'deadline-3', title: 'Resource exchange pickup window', type: 'resource', due: '2026-08-27' },
];

export const MOCK_COMMUNITY_BOARD: CommunityBoardItem[] = [
  {
    id: 'community-1',
    category: 'lost_found',
    title: 'Found calculator near Block B',
    detail: 'Shared by security desk after noon session.',
    owner: 'Security Office',
    status: 'Unclaimed',
  },
  {
    id: 'community-2',
    category: 'resource_exchange',
    title: 'DBMS textbook available',
    detail: 'Senior student offering a lightly used copy for exchange.',
    owner: 'Ritika Sharma',
    status: 'Available',
  },
];

export const DEMO_CREDENTIALS = [
  {
    label: 'Faculty',
    roleKey: 'faculty' as const,
    name: 'Dr. Meera Nair',
    email: 'faculty@campusconnect.edu',
    password: 'faculty123',
  },
  {
    label: 'Placement Admin',
    roleKey: 'placement_admin' as const,
    name: 'Placement Cell',
    email: 'placement@campusconnect.edu',
    password: 'placement123',
  },
  {
    label: 'Campus Admin',
    roleKey: 'campus_admin' as const,
    name: 'Campus Administrator',
    email: 'admin@campusconnect.edu',
    password: 'admin123',
  },
];

export type DemoCredential = (typeof DEMO_CREDENTIALS)[number];
