import React from 'react';

interface ProductivitySnapshotProps {
  efficiencyMetric?: number;
}

export const ProductivitySnapshot: React.FC<ProductivitySnapshotProps> = ({ efficiencyMetric = 0 }) => {
  const efficiency = Math.min(100, Math.max(0, efficiencyMetric));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Productivity Snapshot</h3>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{efficiency}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${efficiency}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-slate-500 font-mono">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProductivitySnapshot;

