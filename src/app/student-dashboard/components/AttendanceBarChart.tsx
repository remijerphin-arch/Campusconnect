'use client';

import dynamic from 'next/dynamic';

const AttendanceBarChartInner = dynamic(
  () => import('@/app/student-dashboard/components/AttendanceBarChartInner'),
  { ssr: false }
);

export default function AttendanceBarChart() {
  return <AttendanceBarChartInner />;
}
