import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sanitizeNotificationLink } from '../components/notifications/NotificationCenter';
import { normalizeSearchResultRoute } from '../components/search/GlobalSearch';
import { useNotificationStore } from '../state/notificationStore';

import { apiClient } from '../api/client';

describe('Components Security & Navigation Routing Suite', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
      fetchNotifications: vi.fn().mockResolvedValue(undefined) as any,
    });
    vi.spyOn(apiClient, 'patch').mockResolvedValue({ success: true } as any);
    vi.clearAllMocks();
  });

  describe('Notification Link Sanitization (Component Security)', () => {
    it('accepts valid in-app relative routes with query parameters', () => {
      expect(sanitizeNotificationLink('/app/projects/tasks?id=123')).toBe('/app/projects/tasks?id=123');
      expect(sanitizeNotificationLink('/app/knowledge/documents?docId=doc-abc')).toBe(
        '/app/knowledge/documents?docId=doc-abc',
      );
    });

    it('normalizes legacy routes safely', () => {
      expect(sanitizeNotificationLink('/app/tasks/123')).toBe('/app/projects/tasks?taskId=123');
      expect(sanitizeNotificationLink('/app/workspace/planner')).toBe('/app/workspace/weeklyplanner');
    });

    it('blocks dangerous XSS protocols and scheme injections', () => {
      expect(sanitizeNotificationLink('javascript:alert(document.cookie)')).toBeNull();
      expect(sanitizeNotificationLink('JAVASCRIPT:void(0)')).toBeNull();
      expect(sanitizeNotificationLink('data:text/html,<script>alert(1)</script>')).toBeNull();
      expect(sanitizeNotificationLink('vbscript:msgbox("pwnd")')).toBeNull();
      expect(sanitizeNotificationLink('file:///etc/passwd')).toBeNull();
    });

    it('blocks open-redirect attempts and protocol-relative URLs', () => {
      expect(sanitizeNotificationLink('//attacker.site/phish')).toBeNull();
      expect(sanitizeNotificationLink('\\\\attacker.site\\phish')).toBeNull();
      expect(sanitizeNotificationLink('https://evil-site.com/app/projects')).toBeNull();
      expect(sanitizeNotificationLink('http://insecure.org/login')).toBeNull();
    });

    it('handles falsy or whitespace links gracefully', () => {
      expect(sanitizeNotificationLink('')).toBeNull();
      expect(sanitizeNotificationLink('   ')).toBeNull();
      expect(sanitizeNotificationLink(undefined)).toBeNull();
      expect(sanitizeNotificationLink(null as any)).toBeNull();
    });
  });

  describe('Global Search Route Normalization', () => {
    it('transforms standalone tasks route to project tasks page', () => {
      expect(normalizeSearchResultRoute('/app/tasks/task-999')).toBe(
        '/app/projects/tasks?taskId=task-999',
      );
      expect(normalizeSearchResultRoute('/app/tasks')).toBe('/app/projects/tasks');
    });

    it('transforms project routes with query parameters without breaking subroutes', () => {
      expect(normalizeSearchResultRoute('/app/projects/proj-456')).toBe(
        '/app/projects?projectId=proj-456',
      );
      expect(normalizeSearchResultRoute('/app/projects/tasks')).toBe('/app/projects/tasks');
      expect(normalizeSearchResultRoute('/app/projects/files')).toBe('/app/projects/files');
    });

    it('redirects planner and calendar aliases to canonical routes', () => {
      expect(normalizeSearchResultRoute('/app/planner')).toBe('/app/workspace/weeklyplanner');
      expect(normalizeSearchResultRoute('/app/workspace/planner')).toBe('/app/workspace/weeklyplanner');
      expect(normalizeSearchResultRoute('/app/calendar')).toBe('/app/workspace/calendar');
    });
  });

  describe('Notification Center State Operations', () => {
    it('adds notification with link and tracks unread count', () => {
      useNotificationStore.getState().addNotification({
        title: 'Security Alert',
        description: 'New login detected',
        type: 'system',
        link: '/app/settings/security',
      });

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.unreadCount).toBe(1);
      expect(state.notifications[0].title).toBe('Security Alert');
      expect(state.notifications[0].link).toBe('/app/settings/security');
      expect(state.notifications[0].read).toBe(false);
    });

    it('marks notification as read and decrements unread count', () => {
      useNotificationStore.getState().addNotification({
        title: 'Task Assigned',
        description: 'Task 1 has been assigned to you',
        type: 'project',
        link: '/app/projects/tasks?id=1',
      });

      const addedId = useNotificationStore.getState().notifications[0].id;
      useNotificationStore.getState().markAsRead(addedId);

      const state = useNotificationStore.getState();
      expect(state.notifications[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });
  });
});
