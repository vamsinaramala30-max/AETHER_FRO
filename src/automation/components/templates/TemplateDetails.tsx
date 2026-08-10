import React from 'react';
import { AutomationTemplate } from '../../automation-types';
import { AutomationDialog } from '../shared/AutomationDialog';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface Props {
  template: AutomationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: AutomationTemplate) => void;
}

export const TemplateDetails: React.FC<Props> = ({ template, isOpen, onClose, onUseTemplate }) => {
  if (!template) return null;

  return (
    <AutomationDialog
      isOpen={isOpen}
      onClose={onClose}
      title={template.title}
      description={template.description}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Category: {template.category}</span>
            <span>Est. Time Saved: {template.estimatedTimeSaved}</span>
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Pre-configured Workflow Steps:</h4>
        <div className="space-y-2">
          {template.preset.steps.map((step, i) => (
            <div
              key={step.id || i}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-400">
                {i + 1}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</p>
                {step.subtitle && <p className="text-[11px] text-slate-500">{step.subtitle}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onUseTemplate(template);
              onClose();
            }}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            <Zap className="mr-1.5 h-4 w-4" />
            Use Template Now
          </Button>
        </div>
      </div>
    </AutomationDialog>
  );
};
