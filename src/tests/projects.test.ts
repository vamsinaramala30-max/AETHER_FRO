import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProjectStore, type Project } from '../state/projectStore';
import { projectService } from '../services/projectService';
import { projectsApi } from '../api/Index';

describe('Project Store & Service Behavior Suite', () => {
  const mockProjects: Project[] = [
    { id: 'proj-1', name: 'Titan Core', description: 'Core engine', status: 'active', updatedAt: '2026-10-10' },
    { id: 'proj-2', name: 'Legacy Archive', description: 'Old docs', status: 'archived', updatedAt: '2026-10-09' },
  ];

  beforeEach(() => {
    useProjectStore.setState({
      projects: [],
      activeProject: null,
      isLoading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  describe('useProjectStore state lifecycle', () => {
    it('sets projects list and updates loading flag', () => {
      useProjectStore.getState().setLoading(true);
      expect(useProjectStore.getState().isLoading).toBe(true);

      useProjectStore.getState().setProjects(mockProjects);
      const state = useProjectStore.getState();
      expect(state.projects).toHaveLength(2);
      expect(state.isLoading).toBe(false);
    });

    it('adds new project to head of list', () => {
      useProjectStore.getState().setProjects([mockProjects[0]]);
      useProjectStore.getState().addProject(mockProjects[1]);

      const state = useProjectStore.getState();
      expect(state.projects).toHaveLength(2);
      expect(state.projects[0].id).toBe('proj-2');
    });

    it('updates project fields and synchronizes activeProject if matching', () => {
      useProjectStore.getState().setProjects(mockProjects);
      useProjectStore.getState().setActiveProject(mockProjects[0]);

      useProjectStore.getState().updateProject('proj-1', { name: 'Titan Core V2', status: 'completed' });

      const state = useProjectStore.getState();
      expect(state.projects[0].name).toBe('Titan Core V2');
      expect(state.projects[0].status).toBe('completed');
      expect(state.activeProject?.name).toBe('Titan Core V2');
    });

    it('removes project and unsets activeProject if removed', () => {
      useProjectStore.getState().setProjects(mockProjects);
      useProjectStore.getState().setActiveProject(mockProjects[0]);

      useProjectStore.getState().removeProject('proj-1');

      const state = useProjectStore.getState();
      expect(state.projects).toHaveLength(1);
      expect(state.projects[0].id).toBe('proj-2');
      expect(state.activeProject).toBeNull();
    });
  });

  describe('projectService API delegation', () => {
    it('delegates listProjects to projectsApi.getAll', async () => {
      const spy = vi.spyOn(projectsApi, 'getAll').mockResolvedValue(mockProjects as any);

      const result = await projectService.listProjects('ws-1');
      expect(spy).toHaveBeenCalledWith('ws-1');
      expect(result).toHaveLength(2);
    });

    it('delegates createProject to projectsApi.create', async () => {
      const payload = { workspaceId: 'ws-1', name: 'New Project', description: 'Desc' };
      const created = { id: 'proj-new', ...payload, status: 'active', updatedAt: '2026-10-10' };
      const spy = vi.spyOn(projectsApi, 'create').mockResolvedValue(created as any);

      const result = await projectService.createProject(payload as any);
      expect(spy).toHaveBeenCalledWith(payload);
      expect(result.id).toBe('proj-new');
    });

    it('delegates deleteProject to projectsApi.delete', async () => {
      const spy = vi.spyOn(projectsApi, 'delete').mockResolvedValue(undefined);

      await projectService.deleteProject('proj-1');
      expect(spy).toHaveBeenCalledWith('proj-1');
    });
  });
});
