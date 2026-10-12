import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWorkspaceStore, type Workspace } from '../state/workspaceStore';
import { workspaceService } from '../services/workspaceService';
import { workspaceApi } from '../api/workspace.api';

describe('Workspace Store & Service Behavior Suite', () => {
  const mockWorkspaces: Workspace[] = [
    { id: 'ws-1', name: 'Alpha Workspace', slug: 'alpha', membersCount: 5 },
    { id: 'ws-2', name: 'Beta Workspace', slug: 'beta', membersCount: 2 },
  ];

  beforeEach(() => {
    useWorkspaceStore.setState({
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  describe('useWorkspaceStore state transitions', () => {
    it('sets workspaces list and clears loading status', () => {
      useWorkspaceStore.getState().setLoading(true);
      expect(useWorkspaceStore.getState().isLoading).toBe(true);

      useWorkspaceStore.getState().setWorkspaces(mockWorkspaces);
      const state = useWorkspaceStore.getState();
      expect(state.workspaces).toHaveLength(2);
      expect(state.workspaces[0].name).toBe('Alpha Workspace');
      expect(state.isLoading).toBe(false);
    });

    it('sets and clears active workspace selection', () => {
      useWorkspaceStore.getState().setCurrentWorkspace(mockWorkspaces[0]);
      expect(useWorkspaceStore.getState().currentWorkspace?.id).toBe('ws-1');

      useWorkspaceStore.getState().setCurrentWorkspace(null);
      expect(useWorkspaceStore.getState().currentWorkspace).toBeNull();
    });

    it('records error message and terminates loading indicator', () => {
      useWorkspaceStore.getState().setLoading(true);
      useWorkspaceStore.getState().setError('Failed to fetch workspace topology');

      const state = useWorkspaceStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch workspace topology');
    });
  });

  describe('workspaceService API integration', () => {
    it('delegates getWorkspaces to workspaceApi', async () => {
      const spy = vi.spyOn(workspaceApi, 'getWorkspaces').mockResolvedValue(mockWorkspaces as any);

      const result = await workspaceService.getWorkspaces();
      expect(spy).toHaveBeenCalledOnce();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('ws-1');
    });

    it('delegates createWorkspace with correct payload', async () => {
      const created = { id: 'ws-new', name: 'Gamma', slug: 'gamma', membersCount: 1 };
      const spy = vi.spyOn(workspaceApi, 'createWorkspace').mockResolvedValue(created as any);

      const result = await workspaceService.createWorkspace('Gamma', 'Gamma desc', 'gamma');
      expect(spy).toHaveBeenCalledWith({ name: 'Gamma', description: 'Gamma desc', slug: 'gamma' });
      expect(result.id).toBe('ws-new');
    });

    it('delegates member management (addMember, removeMember)', async () => {
      const member = {
        id: 'm-1',
        workspaceId: 'ws-1',
        userId: 'usr-1',
        role: 'MEMBER' as const,
        createdAt: '2026-10-10',
        user: { id: 'usr-1', email: 'test@aether.ai', fullName: 'Tester', role: 'MEMBER' },
      };
      const addSpy = vi.spyOn(workspaceApi, 'addMember').mockResolvedValue(member as any);
      const removeSpy = vi.spyOn(workspaceApi, 'removeMember').mockResolvedValue(undefined);

      const added = await workspaceService.addMember('ws-1', { email: 'test@aether.ai', role: 'MEMBER' });
      expect(addSpy).toHaveBeenCalledWith('ws-1', { email: 'test@aether.ai', role: 'MEMBER' });
      expect(added.user.email).toBe('test@aether.ai');

      await workspaceService.removeMember('ws-1', 'm-1');
      expect(removeSpy).toHaveBeenCalledWith('ws-1', 'm-1');
    });
  });
});
