import React from 'react';
import { AutomationRule, AutomationStatus } from '../automation-types';
import { AutomationList } from '../components/automations/AutomationList';
import { AutomationSearch } from '../components/automations/AutomationSearch';
import { AutomationFilters } from '../components/automations/AutomationFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  automations: AutomationRule[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'ALL' | AutomationStatus;
  onStatusChange: (status: 'ALL' | AutomationStatus) => void;
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onDuplicate: (rule: AutomationRule) => void;
  onViewActivity: (ruleId: string) => void;
  onDelete: (id: string) => void;
  onOpenCreate: () => void;
}

export const MyAutomations: React.FC<Props> = ({
  automations,
  isLoading,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onToggleStatus,
  onRunNow,
  onDuplicate,
  onViewActivity,
  onDelete,
  onOpenCreate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <AutomationSearch value={searchQuery} onChange={onSearchChange} />
          <AutomationFilters statusFilter={statusFilter} onStatusChange={onStatusChange} />
        </div>
        <Button onClick={onOpenCreate} className="bg-amber-500 text-white hover:bg-amber-600">
          <Plus className="mr-1.5 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <AutomationList
        automations={automations}
        isLoading={isLoading}
        onToggleStatus={onToggleStatus}
        onRunNow={onRunNow}
        onDuplicate={onDuplicate}
        onViewActivity={onViewActivity}
        onDelete={onDelete}
        onCreateNew={onOpenCreate}
      />
    </div>
  );
};
