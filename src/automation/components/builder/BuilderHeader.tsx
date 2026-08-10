import React from 'react';
import { Sliders, Save, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  workflowName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const BuilderHeader: React.FC<Props> = ({
  workflowName,
  onNameChange,
  onSave,
  onClose,
  isSubmitting = false,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Workflow Name..."
            className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none dark:text-white sm:w-64"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">Visual Multi-Step Canvas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="mr-1.5 h-4 w-4" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSubmitting}
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          <Save className="mr-1.5 h-4 w-4" />
          Save Automation
        </Button>
      </div>
    </div>
  );
};
