import React from 'react';
import { AutomationRule, ExecutionLog, AutomationStatsSummary } from '../automation-types';
import { AutomationStats } from '../components/overview/AutomationStats';
import { ActiveAutomations } from '../components/overview/ActiveAutomations';
import { RecentActivity } from '../components/overview/RecentActivity';
import { AutomationHealth } from '../components/overview/AutomationHealth';
import { QuickActions } from '../components/overview/QuickActions';

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

  const stats: AutomationStatsSummary = {
    totalAutomations: automations.length,
    activeCount,
    pausedCount,
    failedCount,
    totalExecutions: logs.length || 42,
    successRate: 98.4,
    timeSavedHours: 12.5,
    systemHealth: failedCount > 0 ? 'Attention Required' : 'Optimal',
  };

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
