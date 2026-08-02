import React from 'react';
import { TimeDistribution } from './timeInsightsService';

interface TimeChartProps {
  data: TimeDistribution[];
  height?: number;
}

export const TimeChart: React.FC<TimeChartProps> = ({ data, height = 300 }) => {
  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div
      style={{ width: '100%', height }}
      className="flex flex-col items-center justify-center p-4"
    >
      {/* Progress Bar Stack */}
      <div className="flex h-6 w-full overflow-hidden rounded-xl bg-slate-800 shadow-inner">
        {data.map((item, index) => {
          const pct = totalHours > 0 ? (item.hours / totalHours) * 100 : 0;
          return (
            <div
              key={index}
              style={{ width: `${pct}%`, backgroundColor: item.fillColor }}
              className="group relative h-full transition-all duration-300"
              title={`${item.category}: ${item.hours} hrs (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Category Grid Legend */}
      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {data.map((item, index) => {
          const pct = totalHours > 0 ? Math.round((item.hours / totalHours) * 100) : 0;
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 p-2"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.fillColor }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-200">{item.category}</p>
                <p className="text-[10px] text-slate-500">
                  {item.hours} hrs ({pct}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeChart;
