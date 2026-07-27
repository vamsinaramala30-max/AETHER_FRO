import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface UserProfile {
  name: string;
  role?: string;
  avatarUrl?: string;
}

export interface WelcomeHeaderProps {
  user?: UserProfile | null;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  user,
  lastUpdated = new Date(),
  onRefresh,
  isRefreshing = false,
}) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(lastUpdated);
  }, [lastUpdated]);

  const displayName = user?.name || "Member";

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          {greeting}, <span className="text-indigo-400">{displayName}</span>
        </h1>
        <p className="text-sm text-slate-400">
          {user?.role ? `${user.role} • ` : ""}System status optimal. Last synced at {formattedTime}.
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh Dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 border border-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
        </button>
      )}
    </motion.header>
  );
};

export default WelcomeHeader;