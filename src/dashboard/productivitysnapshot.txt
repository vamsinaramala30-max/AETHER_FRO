import React from "react";
import { motion } from "framer-motion";

export interface ProductivityData {
  weeklyGoalHours: number;
  completedHours: number;
  focusScore: number; // 0-100
  efficiencyRating: string;
}

export interface ProductivitySnapshotProps {
  data?: ProductivityData;
  isLoading?: boolean;
}

const defaultData: ProductivityData = {
  weeklyGoalHours: 40,
  completedHours: 31.5,
  focusScore: 88,
  efficiencyRating: "Optimal",
};

export const ProductivitySnapshot: React.FC<ProductivitySnapshotProps> = ({
  data = defaultData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-4">
        <div className="h-6 w-40 bg-slate-800 rounded" />
        <div className="h-24 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  const { weeklyGoalHours, completedHours, focusScore, efficiencyRating } = data;
  const percentage = weeklyGoalHours > 0
    ? Math.min(Math.round((completedHours / weeklyGoalHours) * 100), 100)
    : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl"
      aria-label="Productivity Snapshot"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-100">Productivity Snapshot</h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
          {efficiencyRating}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span>Weekly Goal Progress</span>
            <span className="text-slate-200 font-mono">
              {completedHours}h / {weeklyGoalHours}h ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Focus Score</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block font-mono">
              {focusScore}<span className="text-xs text-slate-500">/100</span>
            </span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-500 block">Time Tracked</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block font-mono">
              {completedHours}h
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductivitySnapshot;