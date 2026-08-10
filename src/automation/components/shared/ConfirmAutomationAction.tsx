import React from 'react';
import { AutomationDialog } from './AutomationDialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmAutomationAction: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action? This step cannot be undone.',
  confirmLabel = 'Confirm',
  isDestructive = true,
}) => {
  return (
    <AutomationDialog isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-3.5 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{description}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </AutomationDialog>
  );
};
