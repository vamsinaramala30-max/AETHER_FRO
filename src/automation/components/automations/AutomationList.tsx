import React from 'react';
import { AutomationRule } from '../../automation-types';
import { AutomationCard } from './AutomationCard';
import { AutomationEmptyState } from '../shared/AutomationEmptyState';
import { AutomationLoading } from '../shared/AutomationLoading';

interface Props {
  automations: AutomationRule[];
  isLoading: boolean;
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onDuplicate: (rule: AutomationRule) => void;
  onViewActivity: (ruleId: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (rule: AutomationRule) => void;
  onCreateNew?: () => void;
}

export const AutomationList: React.FC<Props> = ({
  automations,
  isLoading,
  onToggleStatus,
  onRunNow,
  onDuplicate,
  onViewActivity,
  onDelete,
  onEdit,
  onCreateNew,
}) => {
  if (isLoading) {
    return <AutomationLoading count={4} />;
  }

  if (automations.length === 0) {
    return <AutomationEmptyState onAction={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {automations.map((rule) => (
        <AutomationCard
          key={rule.id}
          rule={rule}
          onToggleStatus={onToggleStatus}
          onRunNow={onRunNow}
          onDuplicate={onDuplicate}
          onViewActivity={onViewActivity}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
