import React from "react";
import { motion } from "framer-motion";

export interface QuickActionItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions?: QuickActionItem[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const defaultActions: QuickActionItem[] = [
    {
      id: "action-1",
      label: "New Project",
      description: "Initialize workspace",
      onClick: () => {},
    },
    {
      id: "action-2",
      label: "Invite Team",
      description: "Manage permissions",
      onClick: () => {},
    },
    {
      id: "action-3",
      label: "System Logs",
      description: "View runtime audit",
      onClick: () => {},
    },
    {
      id: "action-4",
      label: "Settings",
      description: "Configure options",
      onClick: () => {},
    },
  ];

  const actionList = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl"
      aria-label="Quick Actions"
    >
      <h2 className="text-lg font-bold text-slate-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actionList.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className="flex flex-col items-start p-3.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
              {action.label}
            </span>
            {action.description && (
              <span className="text-xs text-slate-500 mt-1 line-clamp-1">{action.description}</span>
            )}
          </button>
        ))}
      </div>
    </motion.section>
  );
};

export default QuickActions;