import { useState, useEffect, useCallback } from 'react';
import { AutomationRule, AutomationStatus } from '../automation-types';
import { automationService } from '../services/automation-service';

export function useAutomations(
  initialFilter: { search?: string; status?: 'ALL' | AutomationStatus } = {},
) {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialFilter.search || '');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AutomationStatus>(
    initialFilter.status || 'ALL',
  );

  const refreshAutomations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await automationService.fetchAutomations();
      setAutomations(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load automations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAutomations();
  }, [refreshAutomations]);

  const filteredAutomations = automations.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return {
    automations: filteredAutomations,
    allAutomations: automations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshAutomations,
  };
}
