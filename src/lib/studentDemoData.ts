/**
 * DEMO STUDENT DATA
 * Uses the authoritative student roster from authoritative-student-roster.ts
 * 
 * This file generates extended profile data for each student
 * while using the authoritative register numbers, names, emails, and passwords
 */

import { AUTHORITATIVE_STUDENT_ROSTER, getAuthoritativeStudentByEmail, getAuthoritativeStudentByRegisterNumber } from './authoritative-student-roster';

export type DemoStudentProfile = {
  id: string;
  registerNumber: string;
  fullName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  course: string;
  program: string;
  department: string;
  section: string;
  semester: number;
  academicYear: string;
  admissionYear: number;
  currentSemester: number;
  avatar: string;
  guardianName: string;
  guardianPhone: string;
  emergencyContact: string;
  studentStatus: 'Active' | 'On Leave' | 'Probation';
  skills: string[];
  certifications: string[];
  languages: string[];
  achievements: string[];
  projects: string[];
  linkedin: string;
  github: string;
  portfolio: string;
  resume: string;
  rollNumber: string;
  attendance: { subject: string; present: number; total: number; percentage: number }[];
  placement: {
    status: string;
    eligible: boolean;
    companies: string[];
    internships: string[];
    resumeReady: boolean;
  };
  academicPerformance: {
    cgpa: number;
    credits: number;
    achievements: string[];
    skills: string[];
    certifications: string[];
    projects: string[];
    internships: string[];
  };
  semesterMarks: Record<number, Array<{
    subject: string;
    cia1: number;
    cia2: number;
    cia3: number;
    overallCia: number;
    ese: number;
    total: number;
    grade: string;
    percentage: number;
    credits: number;
    code: string;
  }>>;
  notifications: Array<{ id: string; title: string; body: string; type: 'academic' | 'attendance' | 'placement' | 'general'; time: string; unread: boolean }>;
};

const course = 'Bachelor of Technology';
const department = 'Artificial Intelligence and Machine Learning';
const baseSection = ['A', 'B', 'C'];
const cities = ['Bengaluru', 'Chennai', 'Hyderabad', 'Coimbatore', 'Kochi', 'Pune', 'Mysuru', 'Vijayawada'];
const states = ['Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala', 'Maharashtra', 'Andhra Pradesh'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const subjectCatalog: Record<number, Array<{ code: string; name: string; credits: number }>> = {
  1: [
    { code: 'BS101', name: 'Engineering Mathematics I', credits: 4 },
    { code: 'CS101', name: 'Programming in C', credits: 3 },
    { code: 'CS102', name: 'Digital Logic Design', credits: 3 },
    { code: 'EC101', name: 'Basic Electronics', credits: 3 },
    { code: 'HS101', name: 'Professional Communication', credits: 2 },
    { code: 'AI101', name: 'Introduction to AI', credits: 2 },
  ],
  2: [
    { code: 'BS201', name: 'Engineering Mathematics II', credits: 4 },
    { code: 'CS201', name: 'Data Structures', credits: 4 },
    { code: 'CS202', name: 'Computer Organization', credits: 3 },
    { code: 'AI201', name: 'Python for AI', credits: 3 },
    { code: 'HS201', name: 'Environmental Science', credits: 2 },
    { code: 'EE201', name: 'Electrical Fundamentals', credits: 3 },
  ],
  3: [
    { code: 'CS301', name: 'Database Management Systems', credits: 4 },
    { code: 'CS302', name: 'Operating Systems', credits: 4 },
    { code: 'AI301', name: 'Machine Learning Foundations', credits: 4 },
    { code: 'CS303', name: 'Computer Networks', credits: 3 },
    { code: 'AI302', name: 'Discrete Mathematics', credits: 3 },
    { code: 'HS301', name: 'Engineering Ethics', credits: 2 },
  ],
  4: [
    { code: 'AI401', name: 'Deep Learning', credits: 4 },
    { code: 'CS401', name: 'Software Engineering', credits: 3 },
    { code: 'AI402', name: 'Computer Vision', credits: 4 },
    { code: 'CS402', name: 'Design and Analysis of Algorithms', credits: 4 },
    { code: 'AI403', name: 'Data Mining', credits: 3 },
    { code: 'CS403', name: 'Web Technologies', credits: 3 },
  ],
  5: [
    { code: 'AI501', name: 'Natural Language Processing', credits: 4 },
    { code: 'AI502', name: 'Neural Networks', credits: 4 },
    { code: 'AI503', name: 'Reinforcement Learning', credits: 3 },
    { code: 'AI504', name: 'AI for Robotics', credits: 3 },
    { code: 'CS501', name: 'Cloud Computing', credits: 3 },
    { code: 'AI505', name: 'MLOps & Deployment', credits: 3 },
  ],
};

function seededRandomInt(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
}

function safeGrade(percentage: number) {
  if (percentage >= 90) return 'S';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'E';
}

function calculateOverallCia(cia1: number, cia2: number, cia3: number) {
  return Math.min(90, cia1 + cia2 + cia3);
}

function getSemesterMarks(semester: number, seed: number) {
  return subjectCatalog[semester].map((subject, subjectIndex) => {
    const subseed = seed + semester * 1000 + subjectIndex * 100;
    const cia1 = seededRandomInt(subseed, 12, 20);
    const cia2 = seededRandomInt(subseed + 1, 35, 50);
    const cia3 = seededRandomInt(subseed + 2, 12, 20);
    const overallCia = calculateOverallCia(cia1, cia2, cia3);
    const ese = seededRandomInt(subseed + 3, 50, 95);
    const total = overallCia + ese;
    const percentage = Math.min(100, Math.round((total / 190) * 100));
    const grade = safeGrade(percentage);

    return {
      subject: subject.name,
      code: subject.code,
      cia1,
      cia2,
      cia3,
      overallCia,
      ese,
      total,
      grade,
      percentage,
      credits: subject.credits,
    };
  });
}

export function buildDemoStudentRecords(): DemoStudentProfile[] {
  return AUTHORITATIVE_STUDENT_ROSTER.map((authStudent, index) => {
    const seed = parseInt(authStudent.registerNumber, 10);
    const city = cities[seed % cities.length];
    const state = states[seed % states.length];
    const gender = seed % 2 === 0 ? 'Male' : 'Female';
    const section = baseSection[seed % baseSection.length];
    const academicYear = '2025-26';
    const admissionYear = 2021;

    const semesterMarks: Record<number, Array<DemoStudentProfile['semesterMarks'][number][number]>> = {};
    for (let semester = 1; semester <= 5; semester += 1) {
      semesterMarks[semester] = getSemesterMarks(semester, seed);
    }

    const attendance = [
      { subject: 'Data Structures', present: seededRandomInt(seed + 100, 28, 40), total: 40 },
      { subject: 'Machine Learning', present: seededRandomInt(seed + 101, 24, 36), total: 38 },
      { subject: 'Database Management Systems', present: seededRandomInt(seed + 102, 30, 42), total: 42 },
      { subject: 'Cloud Computing', present: seededRandomInt(seed + 103, 26, 38), total: 40 },
      { subject: 'Natural Language Processing', present: seededRandomInt(seed + 104, 27, 39), total: 40 },
    ].map((item) => ({
      ...item,
      percentage: Math.round((item.present / item.total) * 100),
    }));

    const allSkills = [
      'Python', 'Java', 'JavaScript', 'SQL', 'C++', 'Machine Learning', 'Data Structures', 'Cloud', 'React', 'Problem Solving'
    ];

    const nameLetters = authStudent.fullName.split(' ')[0].toLowerCase();
    const lastNameLetters = authStudent.fullName.split(' ')[authStudent.fullName.split(' ').length - 1].toLowerCase();

    return {
      id: `demo-student-${index + 1}`,
      registerNumber: authStudent.registerNumber,
      fullName: authStudent.fullName,
      name: authStudent.fullName,
      email: authStudent.email,
      password: authStudent.password,
      phone: `+91 ${seededRandomInt(seed + 200, 6000000000, 9999999999)}`,
      dateOfBirth: `200${seededRandomInt(seed + 250, 3, 5)}-${String(seededRandomInt(seed + 251, 1, 12)).padStart(2, '0')}-${String(seededRandomInt(seed + 252, 1, 28)).padStart(2, '0')}`,
      gender,
      bloodGroup: bloodGroups[seed % bloodGroups.length],
      address: `${seededRandomInt(seed + 300, 10, 250)} ${['Main Road', 'Park Avenue', 'Lake View Road', 'Green Street', 'College Road'][seed % 5]}, ${city}`,
      city,
      state,
      pincode: String(seededRandomInt(seed + 350, 560000, 700000)),
      course,
      program: `${course} (${department})`,
      department,
      section,
      semester: 5,
      academicYear,
      admissionYear,
      currentSemester: 5,
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(authStudent.fullName)}`,
      guardianName: `Guardian of ${authStudent.fullName}`,
      guardianPhone: `+91 ${seededRandomInt(seed + 400, 6000000000, 9999999999)}`,
      emergencyContact: `+91 ${seededRandomInt(seed + 450, 6000000000, 9999999999)}`,
      studentStatus: seed % 7 === 0 ? 'On Leave' : 'Active',
      skills: allSkills.slice(0, 5 + (seed % 3)),
      certifications: ['Python Essentials', 'SQL Fundamentals', 'Machine Learning Basics'],
      languages: ['English', 'Hindi', 'Tamil'],
      achievements: ['Hackathon finalist', 'Class topper', 'Research poster selected'],
      projects: ['CampusConnect', 'AI Attendance Assistant', 'Smart Timetable Generator'],
      linkedin: `linkedin.com/in/${nameLetters}-${lastNameLetters}`,
      github: `github.com/${nameLetters}-${lastNameLetters}`,
      portfolio: `${nameLetters}${lastNameLetters}.dev`,
      resume: `${authStudent.registerNumber}-resume.pdf`,
      rollNumber: authStudent.registerNumber,
      attendance,
      placement: {
        status: seed % 3 === 0 ? 'Open to placements' : 'Eligible for placements',
        eligible: true,
        companies: ['Infosys', 'TCS', 'Microsoft', 'Amazon', 'Accenture'],
        internships: ['AI Research Internship', 'Product Engineering Intern', 'Full Stack Intern'],
        resumeReady: true,
      },
      academicPerformance: {
        cgpa: Number((7.8 + ((seed % 15) * 0.11)).toFixed(2)),
        credits: 118,
        achievements: ['Hackathon finalist', 'Class topper', 'Research poster selected'],
        skills: allSkills.slice(0, 5 + (seed % 3)),
        certifications: ['Python Essentials', 'SQL Fundamentals', 'Machine Learning Basics'],
        projects: ['CampusConnect', 'AI Attendance Assistant', 'Smart Timetable Generator'],
        internships: ['AI Lab Intern', 'Software Developer Intern'],
      },
      semesterMarks,
      notifications: [
        { id: `notif-${index + 1}-1`, title: 'New timetable update', body: 'Your semester timetable has been updated for this week.', type: 'academic', time: '2h ago', unread: true },
        { id: `notif-${index + 1}-2`, title: 'Attendance alert', body: 'Your attendance for Machine Learning is below target.', type: 'attendance', time: '1d ago', unread: false },
        { id: `notif-${index + 1}-3`, title: 'Placement update', body: 'New placement drive notifications are available.', type: 'placement', time: '3d ago', unread: true },
      ],
    };
  });
}

export const DEMO_STUDENT_RECORDS = buildDemoStudentRecords();
export const DEMO_STUDENT_MAP = Object.fromEntries(DEMO_STUDENT_RECORDS.map((student) => [student.email.toLowerCase(), student]));
export const DEMO_STUDENT_BY_REGISTER = Object.fromEntries(DEMO_STUDENT_RECORDS.map((student) => [student.registerNumber, student]));

export function getDemoStudentByEmail(email: string) {
  return DEMO_STUDENT_MAP[email.toLowerCase()] ?? null;
}

export function getDemoStudentByRegisterNumber(registerNumber: string) {
  return DEMO_STUDENT_BY_REGISTER[registerNumber] ?? null;
}

export function generateStudentAutofillList() {
  return DEMO_STUDENT_RECORDS.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    registerNumber: student.registerNumber,
    password: student.password,
  }));
}

export function getDemoStudentCredentialList() {
  return DEMO_STUDENT_RECORDS.map((student) => ({
    label: 'Student',
    roleKey: 'student' as const,
    name: student.fullName,
    email: student.email,
    password: student.password,
    department: student.department,
    rollNumber: student.registerNumber,
    active: true,
  }));
}

export const DEMO_AUTOFILL_STUDENTS = generateStudentAutofillList();
