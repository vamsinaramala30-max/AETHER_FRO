import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, type User } from '../state/authStore';
import { useNotificationStore } from '../state/notificationStore';
import { useProjectStore } from '../state/projectStore';
import { useAutomationStore } from '../state/automationStore';

import { apiClient } from '../api/client';

describe('Auth Store & Session Lifecycle Behavior Suite', () => {
  const testUser: User = {
    id: 'usr-111',
    email: 'architect@aether.ai',
    name: 'Aether Architect',
    role: 'admin',
  };
  const testToken = 'jwt-secure-session-token-12345';

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    (apiClient as any)._requestWithAutoRefresh = vi.fn().mockResolvedValue({});
    (apiClient as any).get = vi.fn().mockResolvedValue({ data: [] });
    (apiClient as any).post = vi.fn().mockResolvedValue({ data: {} });
    useNotificationStore.setState({
      fetchNotifications: () => Promise.resolve(),
    });
  });

  it('initializes in an unauthenticated state with null credentials', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('authenticates user, updates store state, and writes tokens to localStorage', () => {
    const store = useAuthStore.getState();
    store.setAuth(testUser, testToken);

    const updated = useAuthStore.getState();
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.user).toEqual(testUser);
    expect(updated.token).toBe(testToken);
    expect(updated.error).toBeNull();
    expect(localStorage.getItem('aether_access_token')).toBe(testToken);
    expect(localStorage.getItem('auth_token')).toBe(testToken);
  });

  it('updates user profile details without invalidating session or token', () => {
    useAuthStore.getState().setAuth(testUser, testToken);

    const updatedProfile: User = {
      ...testUser,
      name: 'Architect Lead',
      role: 'member',
    };
    useAuthStore.getState().setUser(updatedProfile);

    const current = useAuthStore.getState();
    expect(current.user?.name).toBe('Architect Lead');
    expect(current.user?.role).toBe('member');
    expect(current.isAuthenticated).toBe(true);
    expect(current.token).toBe(testToken);
  });

  it('handles authentication error and clears loading state', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.getState().setError('Invalid credentials or session expired');
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Invalid credentials or session expired');
  });

  it('performs clean logout: clears state, purges localStorage tokens, and resets dependent stores', () => {
    // Seed stores and localStorage
    useAuthStore.getState().setAuth(testUser, testToken);
    useProjectStore.getState().setProjects([
      { id: 'p-1', name: 'Project 1', description: 'Desc', status: 'active', updatedAt: new Date().toISOString() },
    ]);
    useAutomationStore.getState().setWorkflows([
      { id: 'w-1', name: 'Workflow 1', status: 'active' },
    ]);

    expect(localStorage.getItem('aether_access_token')).toBe(testToken);

    // Execute logout
    useAuthStore.getState().logout();

    const loggedOut = useAuthStore.getState();
    expect(loggedOut.isAuthenticated).toBe(false);
    expect(loggedOut.user).toBeNull();
    expect(loggedOut.token).toBeNull();

    // Verify localStorage cleanup
    expect(localStorage.getItem('aether_access_token')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();

    // Verify dependent stores were cleared
    expect(useProjectStore.getState().projects).toEqual([]);
    expect(useAutomationStore.getState().workflows).toEqual([]);
  });
});
