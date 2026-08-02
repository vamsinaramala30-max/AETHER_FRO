import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface GoalProgressChartProps {
  data: Array<{ period: string; completed: number; inProgress: number }>;
  height?: number;
}

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
          <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="completed" name="Completed Goals" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" name="In Progress Goals" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};