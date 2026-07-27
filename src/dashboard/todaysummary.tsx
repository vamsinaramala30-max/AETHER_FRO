import React from "react";
import { motion } from "framer-motion";

export interface Deliverable {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export interface TodaySummaryProps {
  deliverables?: Deliverable[];
  isLoading?: boolean;
}

const defaultDeliverables: Deliverable[] = [
  { id: "d1", title: "Review architectural pull request", completed: true, category: "Core" },
  { id: "d2", title: "Deploy stage updates to production environment", completed: true, category: "DevOps" },
  { id: "d3", title: "Finalize API schema specifications", completed: false, category: "Backend" },
  { id: "d4", title: "Audit accessibility for dashboard accessibility compliance", completed: false, category: "Frontend" },
];

export const TodaySummary: React.FC<TodaySummaryProps> = ({
  deliverables = defaultDeliverables,
  isLoading = false,
}) => {
  const completedCount = deliverables.filter((d) => d.completed).length;
  const progressPercentage = deliverables.length
    ? Math.round((completedCount / deliverables.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-4">
        <div className="h-6 w-36 bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-800 rounded" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/40 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Today's Deliverables</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            {completedCount} of {deliverables.length} Done
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {deliverables.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No deliverables scheduled for today.</p>
        ) : (
          <ul className="space-y-3">
            {deliverables.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      item.completed
                        ? "bg-indigo-500 border-indigo-400 text-slate-950"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {item.completed && (
                      <svg className="w-2.5 h-2.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.completed ? "text-slate-400 line-through" : "text-slate-200"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  );
};

export default TodaySummary;