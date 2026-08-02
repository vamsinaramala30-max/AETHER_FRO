import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ProductivityDataPoint } from './productivityService';

interface ProductivityChartProps {
  data: ProductivityDataPoint[];
  height?: number;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">No productivity trend data available.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="deepWorkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Productivity Score"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
          <Area
            type="monotone"
            dataKey="deepWorkHours"
            name="Deep Work (hrs)"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#deepWorkGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};