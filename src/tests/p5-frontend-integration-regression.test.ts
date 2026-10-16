import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, type User } from '../state/authStore';
import { authService } from '../services/authService';
import { authConfig } from '../config/auth.config';
import { knowledgeApi } from '../api/knowledge.api';
import { apiClient } from '../api/client';
import { useAIStore } from '../ai/ai-store';
import { normalizeSearchResultRoute } from '../components/search/GlobalSearch';

import { useNotificationStore } from '../state/notificationStore';

describe('AETHER P5 — Frontend System Integration Regression Suite', () => {
  const testUser: User = {
    id: 'user-p5-1',
    email: 'integration@aether.ai',
    name: 'Integration Tester',
    role: 'admin',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    useNotificationStore.setState({
      fetchNotifications: () => Promise.resolve(),
    });
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  // =========================================================================
  // 1. INT-01: AUTH REFRESH TOKEN RETENTION & KEY SYNCHRONIZATION
  // =========================================================================
  describe('P5-INT-01: Auth Refresh Token Persistence & Sync', () => {
    it('persists refreshToken under authConfig.refreshTokenKey in useAuthStore', () => {
      useAuthStore.getState().setAuth(testUser, 'access-token-123', 'refresh-token-xyz');

      expect(localStorage.getItem(authConfig.tokenKey)).toBe('access-token-123');
      expect(localStorage.getItem('aether_access_token')).toBe('access-token-123');
      expect(localStorage.getItem('auth_token')).toBe('access-token-123');
      expect(localStorage.getItem(authConfig.refreshTokenKey)).toBe('refresh-token-xyz');
      expect(localStorage.getItem('aether_refresh_token')).toBe('refresh-token-xyz');
    });

    it('authService stores and retrieves refreshToken and access tokens across all keys', () => {
      authService.setToken('access-token-456', 'refresh-token-789');

      expect(authService.getToken()).toBe('access-token-456');
      expect(authService.getRefreshToken()).toBe('refresh-token-789');
      expect(localStorage.getItem('auth_token')).toBe('access-token-456');
      expect(localStorage.getItem('aether_access_token')).toBe('access-token-456');
      expect(localStorage.getItem('aether_refresh_token')).toBe('refresh-token-789');

      authService.clearToken();
      expect(authService.getToken()).toBeNull();
      expect(authService.getRefreshToken()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('aether_access_token')).toBeNull();
      expect(localStorage.getItem('aether_refresh_token')).toBeNull();
    });

    it('useAuthStore.logout thoroughly purges all auth and session keys', () => {
      useAuthStore.getState().setAuth(testUser, 'access-tok', 'refresh-tok');
      expect(localStorage.getItem('aether_access_token')).toBe('access-tok');
      expect(localStorage.getItem('aether_refresh_token')).toBe('refresh-tok');

      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().token).toBeNull();
      expect(localStorage.getItem('aether_access_token')).toBeNull();
      expect(localStorage.getItem('aether_refresh_token')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  // =========================================================================
  // 2. INT-03: KNOWLEDGE API ENVELOPE UNWRAPPING & BIDIRECTIONAL COMPATIBILITY
  // =========================================================================
  describe('P5-INT-03: Knowledge API Response Unwrapping', () => {
    it('unwraps envelope responses for getById', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: {
          id: 'doc-123',
          title: 'Architecture Spec',
          content: 'Detailed system spec',
          tags: ['architecture'],
          createdAt: '2026-01-01',
        },
      });

      const doc = await knowledgeApi.getById('doc-123');
      expect(doc).toEqual({
        id: 'doc-123',
        title: 'Architecture Spec',
        content: 'Detailed system spec',
        tags: ['architecture'],
        createdAt: '2026-01-01',
      });
    });

    it('unwraps envelope responses for create', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        data: {
          id: 'doc-new',
          title: 'New Doc',
          content: 'New content',
          tags: [],
          createdAt: '2026-01-02',
        },
      });

      const created = await knowledgeApi.create({
        title: 'New Doc',
        content: 'New content',
        tags: [],
      });
      expect(created.id).toBe('doc-new');
      expect(created.title).toBe('New Doc');
    });

    it('unwraps list and results for search', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [
          { id: 'doc-1', title: 'Doc 1', content: 'C1', tags: [], createdAt: '2026-01-01' },
        ],
      });

      const results = await knowledgeApi.search({ query: 'Doc 1' });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('doc-1');
    });
  });

  // =========================================================================
  // 3. INT-07: GLOBAL SEARCH ROUTE NORMALIZATION & STORE INTEGRATION
  // =========================================================================
  describe('P5-INT-07: Global Search Integration & Navigation Mapping', () => {
    it('normalizes task, project, planner, and calendar routes correctly', () => {
      expect(normalizeSearchResultRoute('/app/tasks/task-99')).toBe(
        '/app/projects/tasks?taskId=task-99',
      );
      expect(normalizeSearchResultRoute('/app/tasks')).toBe('/app/projects/tasks');
      expect(normalizeSearchResultRoute('/app/projects/proj-101')).toBe(
        '/app/projects?projectId=proj-101',
      );
      expect(normalizeSearchResultRoute('/app/workspace/planner')).toBe(
        '/app/workspace/weeklyplanner',
      );
      expect(normalizeSearchResultRoute('/app/calendar')).toBe('/app/workspace/calendar');
    });

    it('useAIStore conversation state is queryable for global search', () => {
      useAIStore.setState({
        conversations: [
          {
            id: 'conv-ai-1',
            title: 'Neural Engine Architecture',
            createdAt: new Date().toISOString(),
            messages: [
              {
                id: 'm1',
                sender: 'user',
                text: 'How does it work?',
                timestamp: new Date().toISOString(),
              },
            ],
          },
        ] as any,
      });

      const conversations = useAIStore.getState().conversations;
      expect(conversations).toHaveLength(1);
      expect(conversations[0].title).toBe('Neural Engine Architecture');
    });
  });
});
