import React from 'react';
import { LayoutDashboard, Zap, Layers, Activity } from 'lucide-react';

export type AutomationTab = 'overview' | 'automations' | 'templates' | 'activity';

interface Props {
  activeTab: AutomationTab;
  onTabChange: (tab: AutomationTab) => void;
  counts?: {
    automations?: number;
    templates?: number;
    activity?: number;
  };
}

export const AutomationNavigation: React.FC<Props> = ({ activeTab, onTabChange, counts }) => {
  const tabs: Array<{
    id: AutomationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'automations', label: 'My Automations', icon: Zap, count: counts?.automations },
    { id: 'templates', label: 'Templates', icon: Layers, count: counts?.templates },
    { id: 'activity', label: 'Activity', icon: Activity, count: counts?.activity },
  ];

  return (
    <div className="flex border-b border-slate-200/80 dark:border-slate-800">
      <nav
        className="-mb-px flex space-x-6 overflow-x-auto"
        aria-label="Automation primary navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive
                    ? 'text-amber-500'
                    : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                }`}
              />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
