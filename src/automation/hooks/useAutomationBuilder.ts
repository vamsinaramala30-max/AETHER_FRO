import { useState, useCallback } from 'react';
import { WorkflowStep, TriggerType } from '../automation-types';

export interface BuilderState {
  name: string;
  description: string;
  trigger: TriggerType;
  schedule?: string;
  steps: WorkflowStep[];
  selectedStepId?: string;
}

const DEFAULT_INITIAL_STATE: BuilderState = {
  name: 'New Custom Workflow',
  description: '',
  trigger: 'SCHEDULE',
  schedule: '0 8 * * 1-5',
  steps: [
    {
      id: 'step-trigger-1',
      type: 'trigger',
      title: 'Schedule Trigger',
      subtitle: 'Weekdays at 8:00 AM',
      triggerType: 'SCHEDULE',
      config: { schedule: '0 8 * * 1-5' },
    },
    {
      id: 'step-ai-1',
      type: 'ai_action',
      title: 'Ask Aether AI',
      subtitle: 'Analyze workspace tasks and calendar',
      aiActionType: 'ASK_AETHER',
      config: { prompt: 'Review my day and outline priorities.' },
    },
    {
      id: 'step-action-1',
      type: 'action',
      title: 'Send Notification',
      subtitle: 'Notify user with synthesized daily plan',
      actionType: 'CREATE_NOTIFICATION',
      config: { title: 'Daily Plan Briefing' },
    },
  ],
  selectedStepId: 'step-trigger-1',
};

export function useAutomationBuilder(initial?: Partial<BuilderState>) {
  const [state, setState] = useState<BuilderState>({
    ...DEFAULT_INITIAL_STATE,
    ...initial,
  });

  const setWorkFlowName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name }));
  }, []);

  const setWorkFlowDescription = useCallback((description: string) => {
    setState((prev) => ({ ...prev, description }));
  }, []);

  const selectStep = useCallback((stepId: string) => {
    setState((prev) => ({ ...prev, selectedStepId: stepId }));
  }, []);

  const addStep = useCallback((step: Omit<WorkflowStep, 'id'>) => {
    const newStep: WorkflowStep = {
      ...step,
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };
    setState((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
      selectedStepId: newStep.id,
    }));
  }, []);

  const updateStep = useCallback((stepId: string, updates: Partial<WorkflowStep>) => {
    setState((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
    }));
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setState((prev) => {
      const remaining = prev.steps.filter((s) => s.id !== stepId);
      return {
        ...prev,
        steps: remaining,
        selectedStepId: prev.selectedStepId === stepId ? remaining[0]?.id : prev.selectedStepId,
      };
    });
  }, []);

  const reorderSteps = useCallback((startIndex: number, endIndex: number) => {
    setState((prev) => {
      const steps = Array.from(prev.steps);
      const [removed] = steps.splice(startIndex, 1);
      steps.splice(endIndex, 0, removed);
      return { ...prev, steps };
    });
  }, []);

  const resetBuilder = useCallback(() => {
    setState(DEFAULT_INITIAL_STATE);
  }, []);

  return {
    state,
    setState,
    setWorkFlowName,
    setWorkFlowDescription,
    selectStep,
    addStep,
    updateStep,
    removeStep,
    reorderSteps,
    resetBuilder,
    selectedStep: state.steps.find((s) => s.id === state.selectedStepId),
  };
}
