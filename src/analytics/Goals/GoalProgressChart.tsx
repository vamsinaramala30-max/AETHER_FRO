import React from 'react';

interface GoalProgressChartProps {
  data: Array<{ period: string; completed: number; inProgress: number }>;
  height?: number;
}

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({ data, height = 300 }) => {
  const maxVal = Math.max(1, ...data.map((d) => Math.max(d.completed, d.inProgress)));

  return (
    <div style={{ width: '100%', height }} className="flex flex-col justify-end pb-2 pt-4">
      <div className="flex flex-1 items-end gap-4 px-2">
        {data.map((item, index) => {
          const completedHeight = (item.completed / maxVal) * 100;
          const inProgressHeight = (item.inProgress / maxVal) * 100;
          return (
            <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-full max-h-[80%] w-full items-end justify-center gap-1.5">
                <div
                  className="min-h-[4px] w-1/2 rounded-t-md bg-emerald-500 transition-all duration-300"
                  style={{ height: `${completedHeight}%` }}
                  title={`Completed: ${item.completed}`}
                />
                <div
                  className="min-h-[4px] w-1/2 rounded-t-md bg-indigo-500 transition-all duration-300"
                  style={{ height: `${inProgressHeight}%` }}
                  title={`In Progress: ${item.inProgress}`}
                />
              </div>
              <span className="truncate text-[10px] text-slate-500">{item.period}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          <span>Completed Goals</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
          <span>In Progress Goals</span>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressChart;
