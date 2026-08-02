import React from 'react';
import { ProductivityDataPoint } from './productivityService';

interface ProductivityChartProps {
  data: ProductivityDataPoint[];
  height?: number;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50">
        <p className="text-sm text-slate-500">No productivity trend data available.</p>
      </div>
    );
  }

  const maxScore = Math.max(100, ...data.map((d) => d.score));

  return (
    <div style={{ width: '100%', height }} className="flex flex-col justify-end pb-2 pt-4">
      <div className="flex flex-1 items-end gap-3 px-2">
        {data.map((item, index) => {
          const scoreHeight = (item.score / maxScore) * 100;
          return (
            <div
              key={index}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <div className="relative flex h-full max-h-[85%] w-full items-end justify-center">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300"
                  style={{ height: `${scoreHeight}%` }}
                />
              </div>
              <span className="truncate text-[10px] text-slate-500">{item.date}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
          <span>Productivity Score</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
