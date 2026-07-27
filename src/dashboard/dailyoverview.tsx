import React from "react";
import { motion } from "framer-motion";

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  description?: string;
}

export interface DailyOverviewProps {
  metrics?: MetricItem[];
  isLoading?: boolean;
  error?: Error | null;
}

const defaultMetrics: MetricItem[] = [
  { id: "1", label: "Active Tasks", value: "12", change: "+2 today", trend: "up", description: "3 high priority" },
  { id: "2", label: "Completion Rate", value: "94%", change: "+3.2%", trend: "up", description: "Vs 90.8% target" },
  { id: "3", label: "Focus Hours", value: "5.8h", change: "-0.4h", trend: "down", description: "Daily goal: 6.0h" },
  { id: "4", label: "System Load", value: "28%", change: "Stable", trend: "neutral", description: "Peak: 42% at 11:00" },
];

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  metrics = defaultMetrics,
  isLoading = false,
  error = null,
}) => {
  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-800/50 bg-red-950/20 text-red-300 text-sm">
        Failed to load daily metrics: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-28 bg-slate-900/50 rounded-2xl border border-slate-800" />
        ))}
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl border border-slate-800 bg-slate-900/30 text-slate-400 text-sm">
        No daily overview metrics available.
      </div>
    );
  }

  return (
    <section aria-label="Daily Overview Metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {metric.label}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  metric.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : metric.trend === "down"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {metric.change}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              {metric.description && (
                <div className="text-xs text-slate-500 mt-1">{metric.description}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DailyOverview;