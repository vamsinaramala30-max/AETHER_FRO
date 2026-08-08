import React from 'react';
import { ChartDataPoint } from './productivityservice';
import { BarChart2, Activity } from 'lucide-react';

interface ProductivityChartProps {
  data: ChartDataPoint[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const totalFocus = data.reduce((acc, curr) => acc + curr.focusMinutes, 0);
  const maxMinutes = Math.max(...data.map((d) => d.focusMinutes), 60);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Focus Sequence Telemetry
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Attentional focus minutes per day over the current session week.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Activity className="h-3 w-3" />
          <span>{totalFocus}m Total Focus</span>
        </div>
      </div>

      {totalFocus === 0 ? (
        <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <BarChart2 className="mb-2 h-8 w-8 text-slate-400 dark:text-slate-500" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No Focus Telemetry Logged Yet
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Initialize a 25-minute focus timer block to record your attentional data.
          </p>
        </div>
      ) : (
        <div className="flex h-[200px] w-full flex-col justify-between pt-4">
          <div className="flex flex-1 items-end justify-between gap-3 border-b border-slate-200 pb-2 dark:border-slate-800">
            {data.map((point) => {
              const heightPct =
                point.focusMinutes > 0 ? (point.focusMinutes / maxMinutes) * 100 : 0;
              return (
                <div
                  key={point.day}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* Tooltip on hover */}
                  {point.focusMinutes > 0 && (
                    <div className="pointer-events-none absolute -top-8 z-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-slate-800">
                      {point.focusMinutes} mins
                    </div>
                  )}

                  {point.focusMinutes > 0 ? (
                    <div
                      className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300 dark:from-indigo-500 dark:to-indigo-300"
                      style={{ height: `${Math.max(heightPct, 6)}%` }}
                    />
                  ) : (
                    <div className="h-1 w-full max-w-[32px] rounded-full bg-slate-200 dark:bg-slate-800" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            {data.map((point) => (
              <span
                key={point.day}
                className="flex-1 text-center font-mono text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400"
              >
                {point.day}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
