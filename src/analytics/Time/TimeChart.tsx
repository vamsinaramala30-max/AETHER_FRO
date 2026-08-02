import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TimeDistribution } from './timeInsightsService';

interface TimeChartProps {
  data: TimeDistribution[];
  height?: number;
}

export const TimeChart: React.FC<TimeChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="hours"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fillColor} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
            }}
            formatter={(value: number) => [`${value} hrs`, 'Time Spent']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-xs text-slate-700 dark:text-slate-300 mr-2">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};