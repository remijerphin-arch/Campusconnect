import { DEMO_STUDENT_RECORDS, getDemoStudentByEmail } from '@/lib/studentDemoData';

export type StudentPortalOverviewCard = {
  label: string;
  value: string;
  subtext: string;
};

export type StudentSemesterProgress = {
  semester: number;
  gpa: number;
  credits: number;
  percentage: number;
  passed: number;
  failed: number;
  overview: string;
  subjects: string[];
};

export function buildStudentPortalData(student = DEMO_STUDENT_RECORDS[0]) {
  const semesterCodes = [1, 2, 3, 4, 5];

  const semesters: StudentSemesterProgress[] = semesterCodes.map((semester, index) => {
    const marks = student.semesterMarks[semester] ?? [];
    const average = marks.length ? Math.round(marks.reduce((sum, subject) => sum + subject.percentage, 0) / marks.length) : 0;
    const failed = marks.filter((subject) => ['D', 'E'].includes(subject.grade)).length;
    const gpa = Number((7.4 + index * 0.24 + (student.academicPerformance.cgpa - 7.8) * 0.12).toFixed(2));
    const credits = marks.reduce((sum, subject) => sum + (subject.credits ?? 3), 0);

    return {
      semester,
      gpa,
      credits,
      percentage: average,
      passed: Math.max(marks.length - failed, 0),
      failed,
      overview: failed === 0 ? 'Strong performance' : 'Needs attention',
      subjects: marks.slice(0, 4).map((subject) => subject.subject),
    };
  });

  const attendance = (student.attendance ?? []).map((entry) => ({
    subject: entry.subject,
    present: entry.present,
    total: entry.total,
    percentage: entry.percentage,
    status: entry.percentage >= 75 ? 'safe' : entry.percentage >= 60 ? 'warning' : 'danger',
  }));

  const currentSemesterMarks = (student.semesterMarks[student.currentSemester ?? 5] ?? []).map((item) => ({
    subject: item.subject,
    cia1: item.cia1,
    cia2: item.cia2,
    cia3: item.cia3,
    overallCia: item.overallCia,
    ese: item.ese,
    total: item.total,
    grade: item.grade,
    credits: item.credits,
  }));

  const overviewCards: StudentPortalOverviewCard[] = [
    { label: 'CGPA', value: String(student.academicPerformance.cgpa), subtext: 'Updated this term' },
    { label: 'Current Semester GPA', value: String(semesters.at(-1)?.gpa ?? student.academicPerformance.cgpa), subtext: `Sem ${student.currentSemester ?? 5} performance` },
    { label: 'Attendance', value: `${Math.round(attendance.reduce((sum, item) => sum + item.percentage, 0) / Math.max(attendance.length, 1))}%`, subtext: 'College average' },
    { label: 'Credits', value: String(student.academicPerformance.credits), subtext: 'Completed credits' },
    { label: 'Placement Status', value: student.placement?.eligible ? 'Eligible' : 'Review', subtext: 'Active placement cycle' },
  ];

  const todaysClasses = [
    { time: '09:00 AM – 10:00 AM', subject: 'Data Structures', faculty: 'Dr. Demo Faculty', room: 'B-204', type: 'Theory' },
    { time: '10:00 AM – 11:00 AM', subject: 'Database Management System', faculty: 'Demo Faculty', room: 'B-204', type: 'Theory' },
    { time: '12:00 PM – 01:00 PM', subject: 'Machine Learning Lab', faculty: 'Dr. Demo Faculty', room: 'AI Lab 2', type: 'Lab' },
  ];

  const timetable = [
    { day: 'Monday', time: '09:00 – 10:00', subject: 'Data Structures', faculty: 'Dr. Demo Faculty', room: 'B-204', type: 'Theory' },
    { day: 'Monday', time: '10:00 – 11:00', subject: 'Database Management System', faculty: 'Demo Faculty', room: 'B-204', type: 'Theory' },
    { day: 'Tuesday', time: '11:00 – 12:00', subject: 'Machine Learning', faculty: 'Dr. Demo Faculty', room: 'AI Lab 2', type: 'Lab' },
    { day: 'Wednesday', time: '01:00 – 02:00', subject: 'Cloud Computing', faculty: 'Prof. Nair', room: 'C-309', type: 'Theory' },
    { day: 'Thursday', time: '09:00 – 10:00', subject: 'NLP', faculty: 'Dr. S. Rao', room: 'A-110', type: 'Theory' },
  ];

  const notifications = (student.notifications ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.type,
    body: item.body,
    unread: item.unread,
    time: item.time,
  }));

  const documents = [
    { name: 'Semester 5 Mark Card', category: 'Mark Cards', date: '2026-08-20', type: 'PDF', action: 'View' },
    { name: 'Academic Calendar 2026-27', category: 'Academic Documents', date: '2026-08-12', type: 'PDF', action: 'Download' },
    { name: `Course Materials – ${student.semesterMarks[5]?.[0]?.subject ?? 'NLP'}`, category: 'Course Materials', date: '2026-08-15', type: 'DOCX', action: 'View' },
    { name: `Timetable – Semester ${student.currentSemester ?? 5}`, category: 'Timetable', date: '2026-08-18', type: 'PDF', action: 'Download' },
  ];

  const announcements = [
    { title: 'Mid-semester exam schedule published', category: 'Academic', published: '2026-08-29', author: 'Controller of Examinations', priority: 'Important' },
    { title: 'Campus placement preparation workshop', category: 'Placement', published: '2026-08-27', author: 'Placement Cell', priority: 'Normal' },
    { title: 'New cafeteria menu launched', category: 'Campus', published: '2026-08-25', author: 'Campus Admin', priority: 'Urgent' },
  ];

  const requests = [
    { id: 'REQ-2026-00124', type: 'Transcript Request', submitted: '2026-08-17', status: 'Approved', updated: '2026-08-20' },
    { id: 'REQ-2026-00110', type: 'Certificate Request', submitted: '2026-08-05', status: 'Under Review', updated: '2026-08-18' },
    { id: 'REQ-2026-00087', type: 'Bonafide Request', submitted: '2026-07-22', status: 'Completed', updated: '2026-07-25' },
  ];

  const supportTickets = [
    { id: 'SUP-1042', category: 'Academic', subject: 'Course material request', status: 'Open', priority: 'Medium' },
    { id: 'SUP-1020', category: 'Infrastructure', subject: 'Wi-Fi issue in Lab 3', status: 'In Progress', priority: 'High' },
  ];

  const feeInfo = {
    semesterFee: { title: 'Semester Fee', amount: '₹48,000', status: 'Paid', dueDate: '2026-08-31' },
    hostelFee: { title: 'Hostel Fee', amount: '₹22,500', status: 'Pending', dueDate: '2026-09-15' },
    paymentHistory: [
      { label: 'Tuition fee', amount: '₹48,000', date: '2026-07-05' },
      { label: 'Hostel deposit', amount: '₹10,000', date: '2026-06-20' },
    ],
  };

  const grievances = [
    { id: 'GR-1001', category: 'Academic', title: 'Clarification on assignment rubric', status: 'Resolved', priority: 'Medium' },
    { id: 'GR-1007', category: 'Attendance', title: 'Attendance correction request', status: 'In Progress', priority: 'High' },
  ];

  return {
    student,
    overviewCards,
    todaysClasses,
    attendance,
    currentSemesterMarks,
    semesters,
    notifications,
    timetable,
    documents,
    requests,
    supportTickets,
    feeInfo,
    announcements,
    grievances,
    exams: currentSemesterMarks.slice(0, 3).map((mark) => ({
      subject: mark.subject,
      date: '2026-09-08',
      slot: '10:00 AM',
      venue: 'Main Hall',
      type: 'Internal Test',
    })),
    summary: {
      semesterLabel: `Semester ${student.currentSemester ?? 5}`,
      courseLabel: `${student.course} ${student.department}`,
      section: student.section,
      registerNumber: student.registerNumber,
    },
  };
}

export function getActiveStudentPortalData(email?: string) {
  const resolvedEmail = email?.trim().toLowerCase();
  const match = resolvedEmail ? getDemoStudentByEmail(resolvedEmail) : null;
  return buildStudentPortalData(match ?? DEMO_STUDENT_RECORDS[0]);
}
