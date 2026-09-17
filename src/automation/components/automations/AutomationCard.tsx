import React from 'react';
import { Zap, Clock, Calendar, CheckCircle2, Play } from 'lucide-react';
import { AutomationRule } from '../../automation-types';
import { formatScheduleText, formatRelativeTime, formatTriggerLabel } from '../../automation-utils';
import { AutomationStatusBadge } from './AutomationStatus';
import { AutomationMenu } from './AutomationMenu';
import { Button } from '@/components/ui/button';

interface Props {
  rule: AutomationRule;
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onDuplicate: (rule: AutomationRule) => void;
  onViewActivity: (ruleId: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (rule: AutomationRule) => void;
}

export const AutomationCard: React.FC<Props> = ({
  rule,
  onToggleStatus,
  onRunNow,
  onDuplicate,
  onViewActivity,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-amber-500/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/5">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{rule.name}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatTriggerLabel(rule.trigger)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AutomationStatusBadge status={rule.status} />
            <AutomationMenu
              rule={rule}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onRunNow={onRunNow}
              onDuplicate={onDuplicate}
              onViewActivity={onViewActivity}
              onDelete={onDelete}
            />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {rule.description || 'Automated workspace task sequence.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatScheduleText(rule.schedule)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            Last run: {formatRelativeTime(rule.lastRunAt)}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            {rule.successRate}% success
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-xs text-slate-400">{rule.runCount} total runs</span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRunNow(rule.id)}
            className="h-8 border-amber-500/30 px-2.5 text-xs text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
          >
            <Play className="mr-1 h-3 w-3 fill-current" />
            Run Now
          </Button>
        </div>
      </div>
    </div>
  );
};
