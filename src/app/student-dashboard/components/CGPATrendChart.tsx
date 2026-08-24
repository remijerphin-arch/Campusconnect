'use client';

import dynamic from 'next/dynamic';

const CGPAChartInner = dynamic(
  () => import('@/app/student-dashboard/components/CGPAChartInner'),
  { ssr: false }
);

export default function CGPATrendChart() {
  return <CGPAChartInner />;
}
