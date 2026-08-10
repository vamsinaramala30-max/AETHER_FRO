import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export const AutomationEmptyState: React.FC<Props> = ({
  title = 'No automations found',
  description = 'Automate recurring workspace actions, daily planning, and project updates with AI assistance.',
  actionLabel = 'Create Automation',
  onAction,
  secondaryLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
        <Zap className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button onClick={onAction} className="bg-amber-500 text-white hover:bg-amber-600">
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
