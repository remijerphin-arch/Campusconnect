'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MOCK_CGPA_TREND } from '@/lib/mockData';

export default function CGPAChartInner() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_CGPA_TREND}>
          <XAxis dataKey="semester" tickLine={false} axisLine={false} />
          <YAxis domain={[7.5, 9]} tickLine={false} axisLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cgpa"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
