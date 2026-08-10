import { useState, useEffect } from 'react';
import { AutomationRule } from '../automation-types';
import { automationService } from '../services/automation-service';

export function useAutomation(id?: string) {
  const [automation, setAutomation] = useState<AutomationRule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    automationService
      .fetchAutomationById(id)
      .then((data) => setAutomation(data))
      .catch((err) => setError(err?.message || 'Failed to fetch automation'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { automation, isLoading, error, setAutomation };
}
