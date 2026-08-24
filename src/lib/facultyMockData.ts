export interface FacultySubject {
  id: string;
  code: string;
  name: string;
  semester: number;
  section: string;
  totalStudents: number;
  classesHeld: number;
  avgAttendance: number;
}

export interface FacultyStudent {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  cgpa: number;
  overallAttendance: number;
}

export interface StudentAttendanceRow {
  studentId: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
}

export interface MarksEntry {
  studentId: string;
  name: string;
  rollNumber: string;
  internal1: number;
  internal2: number;
  internal3: number | null;
  practical: number | null;
}

export const FACULTY_SUBJECTS: FacultySubject[] = [
  {
    id: 'sub-1',
    code: 'CS701',
    name: 'Machine Learning',
    semester: 7,
    section: 'A',
    totalStudents: 62,
    classesHeld: 34,
    avgAttendance: 81,
  },
  {
    id: 'sub-2',
    code: 'CS703',
    name: 'Compiler Design',
    semester: 7,
    section: 'A',
    totalStudents: 62,
    classesHeld: 32,
    avgAttendance: 84,
  },
];

export const FACULTY_STUDENTS: FacultyStudent[] = [
  {
    id: 'stu-1',
    name: 'Aarav Menon',
    rollNumber: '21CS012',
    email: 'aarav@campusconnect.edu',
    phone: '+91 9876543210',
    cgpa: 8.9,
    overallAttendance: 88,
  },
  {
    id: 'stu-2',
    name: 'Diya Reddy',
    rollNumber: '21CS024',
    email: 'diya@campusconnect.edu',
    phone: '+91 9988776655',
    cgpa: 8.4,
    overallAttendance: 78,
  },
  {
    id: 'stu-3',
    name: 'Karan Patel',
    rollNumber: '21CS037',
    email: 'karan@campusconnect.edu',
    phone: '+91 9123456780',
    cgpa: 7.5,
    overallAttendance: 69,
  },
];

export const SUBJECT_ATTENDANCE: Record<string, StudentAttendanceRow[]> = {
  'sub-1': FACULTY_STUDENTS.map((student, index) => ({
    studentId: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    status: index === 2 ? 'late' : 'present',
  })),
  'sub-2': FACULTY_STUDENTS.map((student, index) => ({
    studentId: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    status: index === 1 ? 'absent' : 'present',
  })),
};

export const SUBJECT_MARKS: Record<string, MarksEntry[]> = {
  'sub-1': FACULTY_STUDENTS.map((student, index) => ({
    studentId: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    internal1: 28 + index * 3,
    internal2: 30 + index * 2,
    internal3: index === 2 ? null : 29 + index * 2,
    practical: null,
  })),
  'sub-2': FACULTY_STUDENTS.map((student, index) => ({
    studentId: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    internal1: 29 + index * 2,
    internal2: 31 + index * 2,
    internal3: 30 + index,
    practical: 20 + index,
  })),
};
