// frontend/src/workspace/productivity-hub/ProductivityChart.tsx
import React from 'react';
import { ChartDataPoint } from './productivityService';

interface ProductivityChartProps {
  data: ChartDataPoint[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const maxMinutes = Math.max(...data.map(d => d.focusMinutes), 60);

  return (
    <div className="w-full p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 flex flex-col h-[280px]">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-tight text-white">Focus Sequence Mapping</h3>
        <p className="text-xs text-slate-400">Cyclical operational analytics per system window.</p>
      </div>

      {/* Flex row layout representing micro-chart columns safely without heavy rendering dependencies */}
      <div className="flex-1 flex items-end justify-between gap-2 pt-2 border-b border-slate-800/60 pb-1">
        {data.map((point) => {
          const heightPct = (point.focusMinutes / maxMinutes) * 100;
          return (
            <div key={point.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip visualization state */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded text-slate-200 absolute mb-14 shadow-xl z-10 pointer-events-none">
                {point.focusMinutes}m
              </div>
              
              <div 
                className="w-full max-w-[32px] rounded-t-md transition-all duration-300 relative overflow-hidden bg-gradient-to-t from-blue-600/60 to-blue-400"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              />
              
              <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider">{point.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};