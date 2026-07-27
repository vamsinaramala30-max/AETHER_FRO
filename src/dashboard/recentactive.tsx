import React from "react";
import { motion } from "framer-motion";

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status?: "success" | "warning" | "info";
}

export interface RecentActivityProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

const defaultActivities: ActivityItem[] = [
  {
    id: "act-1",
    user: "Deployment Bot",
    action: "deployed build",
    target: "v2.4.0-stage",
    timestamp: "12 mins ago",
    status: "success",
  },
  {
    id: "act-2",
    user: "Security System",
    action: "renewed SSL certificates for",
    target: "api.domain.internal",
    timestamp: "1 hour ago",
    status: "info",
  },
  {
    id: "act-3",
    user: "Database Node 2",
    action: "triggered warning",
    target: "High memory utilization (88%)",
    timestamp: "3 hours ago",
    status: "warning",
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = defaultActivities,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-800 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl"
      aria-label="Recent System Activity"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-100">Recent Activity</h2>
        <span className="text-xs text-slate-500 font-mono">Live Audit Log</span>
      </div>

      {!activities || activities.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500">No recent activity recorded.</div>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60"
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    item.status === "warning"
                      ? "bg-amber-400"
                      : item.status === "info"
                      ? "bg-sky-400"
                      : "bg-emerald-400"
                  }`}
                />
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-slate-100">{item.user}</span>{" "}
                    <span className="text-slate-400">{item.action}</span>{" "}
                    <span className="font-mono text-xs text-indigo-300 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-900/50">
                      {item.target}
                    </span>
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap ml-4 font-mono">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default RecentActivity;