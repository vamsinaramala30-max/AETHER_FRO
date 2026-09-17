import React from 'react';
import { useAutomationBuilder, BuilderState } from '../../hooks/useAutomationBuilder';
import { BuilderHeader } from './BuilderHeader';
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderCanvas } from './BuilderCanvas';
import { StepConfiguration } from './StepConfiguration';
import { automationService } from '../../services/automation-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  initialData?: Partial<BuilderState>;
}

export const AutomationBuilder: React.FC<Props> = ({ isOpen, onClose, onSaved, initialData }) => {
  const { state, setWorkFlowName, selectStep, addStep, updateStep, removeStep, selectedStep } =
    useAutomationBuilder(initialData);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!state.name.trim()) return;
    setIsSubmitting(true);
    try {
      await automationService.createAutomation({
        name: state.name,
        description: state.description || 'Custom visual workflow',
        trigger: state.trigger,
        schedule: state.schedule,
        steps: state.steps,
        isEnabled: true,
      });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Failed to save automation', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPaletteStep = (type: 'condition' | 'ai_action' | 'action') => {
    if (type === 'condition') {
      addStep({
        type: 'condition',
        title: 'Filter Condition Gate',
        subtitle: 'Check workspace condition rule',
        config: { operator: 'equals', field: 'status', value: 'pending' },
      });
    } else if (type === 'ai_action') {
      addStep({
        type: 'ai_action',
        title: 'Aether AI Summarize',
        subtitle: 'Synthesize data & extract key action items',
        aiActionType: 'SUMMARIZE',
        config: { target: 'input' },
      });
    } else {
      addStep({
        type: 'action',
        title: 'Workspace Notification',
        subtitle: 'Alert workspace member',
        actionType: 'CREATE_NOTIFICATION',
        config: { title: 'Workflow Executed' },
      });
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm duration-200 sm:p-6">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <BuilderHeader
          workflowName={state.name}
          onNameChange={setWorkFlowName}
          onSave={handleSave}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />

        <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          <div className="lg:col-span-3">
            <BuilderSidebar onAddStep={handleAddPaletteStep} />
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800 lg:col-span-6 lg:border-b-0 lg:border-r">
            <BuilderCanvas
              steps={state.steps}
              selectedStepId={state.selectedStepId}
              onSelectStep={selectStep}
              onRemoveStep={removeStep}
            />
          </div>

          <div className="lg:col-span-3">
            <StepConfiguration step={selectedStep} onUpdateStep={updateStep} />
          </div>
        </div>
      </div>
    </div>
  );
};
