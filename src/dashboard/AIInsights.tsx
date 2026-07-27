import React from "react";
import { motion } from "framer-motion";

export interface InsightItem {
  id: string;
  type: "critical" | "optimization" | "info";
  title: string;
  summary: string;
  actionText?: string;
  onAction?: () => void;
}

export interface AIInsightsProps {
  insights?: InsightItem[];
  isLoading?: boolean;
}

const defaultInsights: InsightItem[] = [
  {
    id: "ins-1",
    type: "optimization",
    title: "Bundle Optimization",
    summary: "Lazy loading route chunk 'analytics' can reduce initial load time by ~340ms.",
    actionText: "Review Chunk",
  },
  {
    id: "ins-2",
    type: "info",
    title: "Cache Hit Ratio",
    summary: "TanStack Query cache retention rate is operating at 98.2% efficiency over 24 hours.",
  },
];

export const AIInsights: React.FC<AIInsightsProps> = ({
  insights = defaultInsights,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-3">
        <div className="h-6 w-28 bg-slate-800 rounded" />
        <div className="h-20 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl"
      aria-label="Automated System Insights"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Automated Insights
        </h2>
        <span className="text-xs text-indigo-400 font-medium bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-full">
          Engine Active
        </span>
      </div>

      {!insights || insights.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No active insights detected.</p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200">{insight.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    insight.type === "critical"
                      ? "bg-red-950/60 text-red-400 border border-red-800/50"
                      : insight.type === "optimization"
                      ? "bg-amber-950/60 text-amber-400 border border-amber-800/50"
                      : "bg-sky-950/60 text-sky-400 border border-sky-800/50"
                  }`}
                >
                  {insight.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.summary}</p>
              {insight.actionText && insight.onAction && (
                <button
                  type="button"
                  onClick={insight.onAction}
                  className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
                >
                  {insight.actionText} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default AIInsights;