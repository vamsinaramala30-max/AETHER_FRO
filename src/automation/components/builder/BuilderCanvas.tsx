import React from 'react';
import { WorkflowStep } from '../../automation-types';
import { TriggerStepCard } from './TriggerStep';
import { ConditionStepCard } from './ConditionStep';
import { AIActionStepCard } from './AIActionStep';
import { ActionStepCard } from './ActionStep';
import { ScheduleStepCard } from './ScheduleStep';
import { StepConnector } from './StepConnector';

interface Props {
  steps: WorkflowStep[];
  selectedStepId?: string;
  onSelectStep: (stepId: string) => void;
  onRemoveStep: (stepId: string) => void;
}

export const BuilderCanvas: React.FC<Props> = ({
  steps,
  selectedStepId,
  onSelectStep,
  onRemoveStep,
}) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-start bg-slate-50/50 p-6 dark:bg-slate-950/40">
      <div className="w-full max-w-lg space-y-0">
        {steps.map((step, index) => {
          const isSelected = step.id === selectedStepId;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {step.type === 'trigger' && (
                <TriggerStepCard
                  step={step}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(step.id)}
                  onRemove={() => onRemoveStep(step.id)}
                />
              )}

              {step.type === 'condition' && (
                <ConditionStepCard
                  step={step}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(step.id)}
                  onRemove={() => onRemoveStep(step.id)}
                />
              )}

              {step.type === 'ai_action' && (
                <AIActionStepCard
                  step={step}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(step.id)}
                  onRemove={() => onRemoveStep(step.id)}
                />
              )}

              {step.type === 'action' && (
                <ActionStepCard
                  step={step}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(step.id)}
                  onRemove={() => onRemoveStep(step.id)}
                />
              )}

              {step.type === 'schedule' && (
                <ScheduleStepCard
                  step={step}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(step.id)}
                />
              )}

              {!isLast && <StepConnector />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
