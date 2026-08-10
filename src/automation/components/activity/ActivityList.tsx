import React from 'react';
import { ExecutionLog } from '../../automation-types';
import { ActivityItem } from './ActivityItem';
import { AutomationEmptyState } from '../shared/AutomationEmptyState';
import { AutomationLoading } from '../shared/AutomationLoading';

interface Props {
  logs: ExecutionLog[];
  isLoading: boolean;
  onSelectLog: (log: ExecutionLog) => void;
}

export const ActivityList: React.FC<Props> = ({ logs, isLoading, onSelectLog }) => {
  if (isLoading) {
    return <AutomationLoading count={5} />;
  }

  if (logs.length === 0) {
    return (
      <AutomationEmptyState
        title="No activity history"
        description="Execution activity logs will automatically appear here whenever your automations run."
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {logs.map((log) => (
        <ActivityItem key={log.id} log={log} onSelect={onSelectLog} />
      ))}
    </div>
  );
};
