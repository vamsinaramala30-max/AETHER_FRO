// frontend/src/workspace/productivity-hub/ProductivityChart.tsx
import React from 'react';
import { ChartDataPoint } from './productivityservice';

interface ProductivityChartProps {
  data: ChartDataPoint[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const maxMinutes = Math.max(...data.map((d) => d.focusMinutes), 60);

  return (
    <div className="flex h-[280px] w-full flex-col rounded-xl border border-slate-800/80 bg-slate-900/20 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-tight text-white">Focus Sequence Mapping</h3>
        <p className="text-xs text-slate-400">Cyclical operational analytics per system window.</p>
      </div>

      {/* Flex row layout representing micro-chart columns safely without heavy rendering dependencies */}
      <div className="flex flex-1 items-end justify-between gap-2 border-b border-slate-800/60 pb-1 pt-2">
        {data.map((point) => {
          const heightPct = (point.focusMinutes / maxMinutes) * 100;
          return (
            <div
              key={point.day}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              {/* Tooltip visualization state */}
              <div className="pointer-events-none absolute z-10 mb-14 rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 font-mono text-[10px] text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                {point.focusMinutes}m
              </div>

              <div
                className="relative w-full max-w-[32px] overflow-hidden rounded-t-md bg-gradient-to-t from-blue-600/60 to-blue-400 transition-all duration-300"
                style={{ height: `${String(Math.max(heightPct, 4))}%` }}
              />

              <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400">
                {point.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
