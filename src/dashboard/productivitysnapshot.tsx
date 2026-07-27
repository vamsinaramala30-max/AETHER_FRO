import React from 'react';

interface ProductivitySnapshotProps {
  efficiencyMetric?: number;
}

export const ProductivitySnapshot: React.FC<ProductivitySnapshotProps> = ({
  efficiencyMetric = 0,
}) => {
  const efficiency = Math.min(100, Math.max(0, efficiencyMetric));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-300">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-slate-200">
          Productivity Snapshot
        </h3>
        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400">
          {efficiency}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${String(efficiency)}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between font-mono text-[11px] text-slate-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProductivitySnapshot;
