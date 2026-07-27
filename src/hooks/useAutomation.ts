import { useAutomationStore } from '../state/automationStore';

export const useAutomation = () => {
  const workflows = useAutomationStore((s) => s.workflows);
  const isLoading = useAutomationStore((s) => s.isLoading);
  const error = useAutomationStore((s) => s.error);
  const toggleWorkflowStatus = useAutomationStore((s) => s.toggleWorkflowStatus);

  return { workflows, isLoading, error, toggleWorkflowStatus };
};
