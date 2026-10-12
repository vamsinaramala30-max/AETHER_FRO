import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAutomationStore, type Workflow } from '../state/automationStore';
import { automationService } from '../services/automationService';
import { automationApi } from '../api/Index';

describe('Automation Store & Service Behavior Suite', () => {
  const mockWorkflows: Workflow[] = [
    { id: 'wf-1', name: 'Auto-Triage', status: 'active', lastRun: '2026-10-10' },
    { id: 'wf-2', name: 'Nightly Sync', status: 'paused', lastRun: '2026-10-09' },
  ];

  beforeEach(() => {
    useAutomationStore.setState({
      workflows: [],
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  describe('useAutomationStore state operations', () => {
    it('sets workflows and clears loading status', () => {
      useAutomationStore.getState().setLoading(true);
      expect(useAutomationStore.getState().isLoading).toBe(true);

      useAutomationStore.getState().setWorkflows(mockWorkflows);
      const state = useAutomationStore.getState();
      expect(state.workflows).toHaveLength(2);
      expect(state.isLoading).toBe(false);
    });

    it('adds new workflow to the top of the workflow list', () => {
      useAutomationStore.getState().setWorkflows([mockWorkflows[0]]);
      const newWf: Workflow = { id: 'wf-3', name: 'Alert Dispatcher', status: 'draft' };

      useAutomationStore.getState().addWorkflow(newWf);

      const state = useAutomationStore.getState();
      expect(state.workflows).toHaveLength(2);
      expect(state.workflows[0].id).toBe('wf-3');
    });

    it('toggles workflow status between active and paused', () => {
      useAutomationStore.getState().setWorkflows(mockWorkflows);

      // Toggle wf-1 from active to paused
      useAutomationStore.getState().toggleWorkflowStatus('wf-1');
      expect(useAutomationStore.getState().workflows.find((w) => w.id === 'wf-1')?.status).toBe('paused');

      // Toggle wf-1 back from paused to active
      useAutomationStore.getState().toggleWorkflowStatus('wf-1');
      expect(useAutomationStore.getState().workflows.find((w) => w.id === 'wf-1')?.status).toBe('active');
    });

    it('records error state and resets loading indicator', () => {
      useAutomationStore.getState().setLoading(true);
      useAutomationStore.getState().setError('Failed to deploy workflow');

      const state = useAutomationStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to deploy workflow');
    });
  });

  describe('automationService API delegation', () => {
    it('delegates listWorkflows to automationApi.getWorkflows', async () => {
      const spy = vi.spyOn(automationApi, 'getWorkflows').mockResolvedValue(mockWorkflows as any);

      const result = await automationService.listWorkflows();
      expect(spy).toHaveBeenCalledOnce();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('wf-1');
    });

    it('delegates runWorkflow to automationApi.executeWorkflow', async () => {
      const mockResult = { executionId: 'exec-99', status: 'completed', output: { count: 42 } };
      const spy = vi.spyOn(automationApi, 'executeWorkflow').mockResolvedValue(mockResult as any);

      const payload = { dryRun: false };
      const result = await automationService.runWorkflow('wf-1', payload);

      expect(spy).toHaveBeenCalledWith('wf-1', payload);
      expect(result.executionId).toBe('exec-99');
      expect(result.status).toBe('completed');
    });
  });
});
