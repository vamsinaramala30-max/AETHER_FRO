import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../projects/tasks/taskform';
import { taskService } from '../projects/tasks/taskservice';
import { tasksApi } from '../api/tasks.api';
import { projectsApi } from '../api/projects.api';
import { apiClient } from '../api/client';

describe('AETHER P2A — Frontend Task & Project Reliability', () => {
  const mockProjects = [
    { id: 'proj-1111', name: 'Alpha Initiative', workspaceId: 'ws-1' },
    { id: 'proj-2222', name: 'Beta Roadmap', workspaceId: 'ws-1' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('TaskForm Component & Project Selection (P0-1 Fix)', () => {
    it('loads authorized projects from backend and displays them in the selector', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockProjects,
        projects: mockProjects,
      } as any);

      render(<TaskForm onSubmit={vi.fn()} />);

      // Click "Create New Task" button to open the form
      const openBtn = screen.getByText(/Create New Task/i);
      fireEvent.click(openBtn);

      // Wait for projects dropdown to load options
      await waitFor(() => {
        expect(screen.getByText('Alpha Initiative')).toBeDefined();
        expect(screen.getByText('Beta Roadmap')).toBeDefined();
      });

      expect(apiClient.get).toHaveBeenCalledWith('/projects');
    });

    it('requires a project selection and prevents submission with validation error if none selected', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockProjects,
      } as any);

      const submitSpy = vi.fn();
      render(<TaskForm onSubmit={submitSpy} />);

      // Open form
      fireEvent.click(screen.getByText(/Create New Task/i));

      await waitFor(() => {
        expect(screen.getByText('Alpha Initiative')).toBeDefined();
      });

      // Type title
      const titleInput = screen.getByPlaceholderText(/Task title.../i);
      fireEvent.change(titleInput, { target: { value: 'Incomplete Task' } });

      // Change selector back to empty
      const select = screen.getByLabelText(/Target Project/i);
      fireEvent.change(select, { target: { value: '' } });

      // Click Save Task
      const saveBtn = screen.getByText(/Save Task/i);
      fireEvent.click(saveBtn);

      // Submission must be blocked
      expect(submitSpy).not.toHaveBeenCalled();
      expect(
        screen.getByText(/A project selection is required to create a task/i),
      ).toBeDefined();
    });

    it('submits correct projectId with title and task attributes when valid', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockProjects,
      } as any);

      const submitSpy = vi.fn();
      render(<TaskForm onSubmit={submitSpy} />);

      // Open form
      fireEvent.click(screen.getByText(/Create New Task/i));

      await waitFor(() => {
        expect(screen.getByText('Alpha Initiative')).toBeDefined();
      });

      // Enter Title
      fireEvent.change(screen.getByPlaceholderText(/Task title.../i), {
        target: { value: 'Deploy Pipeline' },
      });

      // Select Project
      const select = screen.getByLabelText(/Target Project/i);
      fireEvent.change(select, { target: { value: 'proj-2222' } });

      // Click Save
      fireEvent.click(screen.getByText(/Save Task/i));

      expect(submitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'proj-2222',
          title: 'Deploy Pipeline',
          status: 'todo',
        }),
      );
    });
  });

  describe('taskService projectId Integration', () => {
    it('createTask submits explicit projectId to API layer', async () => {
      const apiCreateSpy = vi.spyOn(tasksApi, 'create').mockResolvedValue({
        data: {
          id: 'tsk-999',
          projectId: 'proj-1111',
          title: 'Service Task',
          status: 'TODO',
          priority: 'MEDIUM',
          labels: ['dev'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as any);

      const result = await taskService.createTask({
        projectId: 'proj-1111',
        title: 'Service Task',
        description: 'Testing taskService',
        status: 'todo',
        priority: 'medium',
        tags: ['dev'],
      });

      expect(apiCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'proj-1111',
          title: 'Service Task',
        }),
      );
      expect(result.projectId).toBe('proj-1111');
    });

    it('getTasks preserves projectId returned by the backend', async () => {
      vi.spyOn(tasksApi, 'getAll').mockResolvedValue({
        data: [
          {
            id: 'tsk-101',
            projectId: 'proj-1111',
            title: 'Persisted Task',
            status: 'TODO',
            priority: 'HIGH',
            labels: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      } as any);

      const tasks = await taskService.getTasks();
      expect(tasks.length).toBe(1);
      expect(tasks[0].projectId).toBe('proj-1111');
      expect(tasks[0].title).toBe('Persisted Task');
    });
  });

  describe('projectsApi.getAll Unwrapping (P0-2 Fix)', () => {
    it('unwraps project array from backend response structure', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockProjects,
        projects: mockProjects,
        total: 2,
      } as any);

      const result = await projectsApi.getAll('ws-1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('proj-1111');
    });
  });
});
