import { useState, useCallback } from 'react';
import { AutomationRule } from '../automation-types';
import { automationService } from '../services/automation-service';
import { automationExecutionService } from '../services/automation-execution-service';

export function useAutomationActions(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const toggleStatus = useCallback(
    async (rule: AutomationRule) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await automationService.toggleAutomationStatus(rule.id, rule.status);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setActionError(err?.message || 'Failed to update automation status');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const runNow = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        const res = await automationExecutionService.executeRule(id);
        if (res && res.success === false) {
          throw new Error('Automation execution failed on server.');
        }
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setActionError(err?.message || 'Failed to trigger automation execution');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const duplicate = useCallback(
    async (rule: AutomationRule) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await automationService.duplicateAutomation(rule);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setActionError(err?.message || 'Failed to duplicate automation');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  const remove = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        await automationService.deleteAutomation(id);
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setActionError(err?.message || 'Failed to delete automation');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess],
  );

  return {
    toggleStatus,
    runNow,
    duplicate,
    remove,
    isSubmitting,
    actionError,
  };
}
