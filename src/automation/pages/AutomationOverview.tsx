import React from 'react';
import { AutomationRule, ExecutionLog, AutomationStatsSummary } from '../automation-types';
import { AutomationStats } from '../components/overview/AutomationStats';
import { ActiveAutomations } from '../components/overview/ActiveAutomations';
import { RecentActivity } from '../components/overview/RecentActivity';
import { AutomationHealth } from '../components/overview/AutomationHealth';
import { QuickActions } from '../components/overview/QuickActions';
import { Zap, Plus } from 'lucide-react';

interface Props {
  automations: AutomationRule[];
  logs: ExecutionLog[];
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onNavigateToTab: (tab: 'automations' | 'templates' | 'activity') => void;
  onOpenQuickAi: () => void;
  onOpenBuilder: () => void;
}

export const AutomationOverview: React.FC<Props> = ({
  automations,
  logs,
  onToggleStatus,
  onRunNow,
  onNavigateToTab,
  onOpenQuickAi,
  onOpenBuilder,
}) => {
  const activeCount = automations.filter((a) => a.status === 'active').length;
  const pausedCount = automations.filter((a) => a.status === 'paused').length;
  const failedCount = automations.filter((a) => a.status === 'failed').length;

  const totalExecutions = logs.length;
  const successfulExecutions = logs.filter(
    (l) => l.status === 'completed' || (l.status as string) === 'success',
  ).length;

  const successRate =
    totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100;
  const timeSavedHours = parseFloat((totalExecutions * 0.15).toFixed(1));

  const stats: AutomationStatsSummary = {
    totalAutomations: automations.length,
    activeCount,
    pausedCount,
    failedCount,
    totalExecutions,
    successRate,
    timeSavedHours,
    systemHealth: failedCount > 0 ? 'Attention Required' : 'Optimal',
  };

  if (automations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <Zap className="mb-4 h-12 w-12 text-amber-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No automations yet</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Automate repetitive work across AETHER with intelligent rules and AI triggers.
        </p>
        <button
          onClick={onOpenQuickAi}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
        >
          <Plus className="h-4 w-4" />
          <span>Create Automation</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <AutomationStats stats={stats} />

      <QuickActions
        onOpenQuickAi={onOpenQuickAi}
        onOpenTemplates={() => onNavigateToTab('templates')}
        onOpenBuilder={onOpenBuilder}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActiveAutomations
          automations={automations}
          onToggleStatus={onToggleStatus}
          onRunNow={onRunNow}
          onNavigateToAll={() => onNavigateToTab('automations')}
        />
        <RecentActivity logs={logs} onNavigateToActivity={() => onNavigateToTab('activity')} />
      </div>

      <AutomationHealth healthStatus={stats.systemHealth} successRate={stats.successRate} />
    </div>
  );
};

