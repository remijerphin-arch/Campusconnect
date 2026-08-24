'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MOCK_ATTENDANCE } from '@/lib/mockData';

const colors = {
  safe: '#0f9f6e',
  warning: '#f5a524',
  danger: '#ef4444',
};

export default function AttendanceBarChartInner() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_ATTENDANCE}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.22} />
          <XAxis dataKey="subject" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="percentage" radius={[12, 12, 0, 0]}>
            {MOCK_ATTENDANCE.map((item) => (
              <Cell key={item.subject} fill={colors[item.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
