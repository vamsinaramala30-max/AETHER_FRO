import React from 'react';
import { WorkflowStep } from '../../automation-types';
import {
  TRIGGER_OPTIONS,
  AI_ACTION_OPTIONS,
  SYSTEM_ACTION_OPTIONS,
} from '../../automation-constants';
import { Input } from '@/components/ui/Input';
import { VariablePicker } from './VariablePicker';

interface Props {
  step?: WorkflowStep;
  onUpdateStep: (stepId: string, updates: Partial<WorkflowStep>) => void;
}

export const StepConfiguration: React.FC<Props> = ({ step, onUpdateStep }) => {
  if (!step) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        Select a step on the canvas to configure its parameters.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Configure Step</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Step ID: {step.id}</p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Step Title
        </label>
        <Input
          value={step.title}
          onChange={(e) => onUpdateStep(step.id, { title: e.target.value })}
          className="bg-white dark:bg-slate-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Subtitle / Summary
        </label>
        <Input
          value={step.subtitle || ''}
          onChange={(e) => onUpdateStep(step.id, { subtitle: e.target.value })}
          placeholder="Brief description of step logic..."
          className="bg-white dark:bg-slate-900"
        />
      </div>

      {step.type === 'trigger' && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Trigger Event Type
          </label>
          <select
            value={step.triggerType || 'SCHEDULE'}
            onChange={(e) => {
              const selected = TRIGGER_OPTIONS.find((t) => t.value === e.target.value);
              onUpdateStep(step.id, {
                triggerType: e.target.value as any,
                title: selected ? selected.label : step.title,
                subtitle: selected ? selected.description : step.subtitle,
              });
            }}
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {TRIGGER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.category})
              </option>
            ))}
          </select>
        </div>
      )}

      {step.type === 'ai_action' && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            AI Directive Capability
          </label>
          <select
            value={step.aiActionType || 'ASK_AETHER'}
            onChange={(e) => {
              const selected = AI_ACTION_OPTIONS.find((a) => a.value === e.target.value);
              onUpdateStep(step.id, {
                aiActionType: e.target.value as any,
                title: selected ? selected.label : step.title,
                subtitle: selected ? selected.description : step.subtitle,
              });
            }}
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {AI_ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {step.type === 'action' && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Workspace Action Type
          </label>
          <select
            value={step.actionType || 'CREATE_TASK'}
            onChange={(e) => {
              const selected = SYSTEM_ACTION_OPTIONS.find((a) => a.value === e.target.value);
              onUpdateStep(step.id, {
                actionType: e.target.value as any,
                title: selected ? selected.label : step.title,
                subtitle: selected ? selected.description : step.subtitle,
              });
            }}
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {SYSTEM_ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <VariablePicker
        onSelectVariable={(varKey) => {
          onUpdateStep(step.id, {
            subtitle: (step.subtitle || '') + ' ' + varKey,
          });
        }}
      />
    </div>
  );
};
