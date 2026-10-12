import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeSearchResultRoute } from '@/components/search/GlobalSearch';
import { sanitizeNotificationLink } from '@/components/notifications/NotificationCenter';
import { useNotificationStore } from '@/state/notificationStore';
import { apiClient } from '@/api/client';

describe('P2C Frontend: Search Navigation, Notifications & Reliability', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
    });
  });

  describe('Global Search Route Normalization', () => {
    it('normalizes task routes to valid /app/projects/tasks paths', () => {
      expect(normalizeSearchResultRoute('/app/tasks/task-abc')).toBe(
        '/app/projects/tasks?taskId=task-abc',
      );
      expect(normalizeSearchResultRoute('/app/tasks')).toBe('/app/projects/tasks');
      expect(normalizeSearchResultRoute('/app/tasks/')).toBe('/app/projects/tasks');
    });

    it('normalizes project routes to /app/projects?projectId=... without breaking subroutes', () => {
      expect(normalizeSearchResultRoute('/app/projects/proj-123')).toBe(
        '/app/projects?projectId=proj-123',
      );
      // Valid project subroutes must remain unchanged
      expect(normalizeSearchResultRoute('/app/projects/tasks')).toBe('/app/projects/tasks');
      expect(normalizeSearchResultRoute('/app/projects/files')).toBe('/app/projects/files');
      expect(normalizeSearchResultRoute('/app/projects/goals')).toBe('/app/projects/goals');
    });

    it('normalizes planner and calendar routes to valid workspace pages', () => {
      expect(normalizeSearchResultRoute('/app/workspace/planner')).toBe(
        '/app/workspace/weeklyplanner',
      );
      expect(normalizeSearchResultRoute('/app/planner')).toBe(
        '/app/workspace/weeklyplanner',
      );
      expect(normalizeSearchResultRoute('/app/calendar')).toBe('/app/workspace/calendar');
    });

    it('preserves valid standard application routes', () => {
      expect(normalizeSearchResultRoute('/app/knowledge/documents')).toBe(
        '/app/knowledge/documents',
      );
      expect(normalizeSearchResultRoute('/app/knowledge/notes')).toBe(
        '/app/knowledge/notes',
      );
      expect(normalizeSearchResultRoute('/app/automation')).toBe('/app/automation');
    });
  });

  describe('Notification Link Sanitization & Security', () => {
    it('allows valid relative application routes and normalizes legacy paths', () => {
      expect(sanitizeNotificationLink('/app/projects/tasks?taskId=123')).toBe(
        '/app/projects/tasks?taskId=123',
      );
      // Legacy task path normalized
      expect(sanitizeNotificationLink('/app/tasks/456')).toBe(
        '/app/projects/tasks?taskId=456',
      );
      // Legacy weekly-planner path normalized
      expect(sanitizeNotificationLink('/app/workspace/planner')).toBe(
        '/app/workspace/weeklyplanner',
      );
    });

    it('blocks dangerous URL protocols like javascript:, vbscript:, data:, file:', () => {
      expect(sanitizeNotificationLink("javascript:alert('xss')")).toBeNull();
      expect(sanitizeNotificationLink("JAVASCRIPT:alert('xss')")).toBeNull();
      expect(sanitizeNotificationLink('data:text/html,<script>alert(1)</script>')).toBeNull();
      expect(sanitizeNotificationLink('vbscript:MsgBox(1)')).toBeNull();
      expect(sanitizeNotificationLink('file:///etc/passwd')).toBeNull();
    });

    it('blocks protocol-relative URLs and untrusted external origins', () => {
      expect(sanitizeNotificationLink('//attacker.site/steal')).toBeNull();
      expect(sanitizeNotificationLink('\\\\attacker.site\\steal')).toBeNull();
      expect(sanitizeNotificationLink('https://evil-phishing.com/app/tasks')).toBeNull();
      expect(sanitizeNotificationLink('http://insecure-site.com')).toBeNull();
    });

    it('handles empty, null, or undefined links safely', () => {
      expect(sanitizeNotificationLink('')).toBeNull();
      expect(sanitizeNotificationLink('   ')).toBeNull();
      expect(sanitizeNotificationLink(undefined)).toBeNull();
      expect(sanitizeNotificationLink(null as any)).toBeNull();
    });
  });

  describe('Notification State: Payload Preservation & Read Behavior', () => {
    it('preserves link and metadata when adding a notification', () => {
      const store = useNotificationStore.getState();
      store.addNotification({
        title: 'Task Assigned',
        description: 'You were assigned to Fix Search',
        type: 'project',
        link: '/app/projects/tasks?taskId=task-999',
        metadata: { taskId: 'task-999', priority: 'HIGH' },
      });

      const updated = useNotificationStore.getState().notifications;
      expect(updated).toHaveLength(1);
      expect(updated[0].title).toBe('Task Assigned');
      expect(updated[0].link).toBe('/app/projects/tasks?taskId=task-999');
      expect(updated[0].metadata).toEqual({ taskId: 'task-999', priority: 'HIGH' });
      expect(updated[0].read).toBe(false);
      expect(useNotificationStore.getState().unreadCount).toBe(1);
    });

    it('marks notification as read without losing link or metadata', () => {
      const store = useNotificationStore.getState();
      store.addNotification({
        title: 'Document Approved',
        description: 'Spec document is ready',
        type: 'system',
        link: '/app/knowledge/documents',
        metadata: { docId: 'doc-101' },
      });

      const notifId = useNotificationStore.getState().notifications[0].id;
      vi.spyOn(apiClient, 'patch').mockResolvedValue({ success: true } as any);

      store.markAsRead(notifId);

      const updated = useNotificationStore.getState().notifications;
      expect(updated[0].read).toBe(true);
      expect(updated[0].link).toBe('/app/knowledge/documents');
      expect(updated[0].metadata).toEqual({ docId: 'doc-101' });
      expect(useNotificationStore.getState().unreadCount).toBe(0);
    });

    it('preserves link and metadata during fetchNotifications API mapping', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: {
          items: [
            {
              id: 'notif-api-1',
              title: 'New Calendar Event',
              message: 'Sprint Retro scheduled',
              type: 'CALENDAR',
              isRead: false,
              createdAt: new Date().toISOString(),
              link: '/app/workspace/calendar',
              metadata: { eventId: 'event-555' },
            },
          ],
        },
      } as any);

      await useNotificationStore.getState().fetchNotifications();

      const notifs = useNotificationStore.getState().notifications;
      expect(notifs).toHaveLength(1);
      expect(notifs[0].title).toBe('New Calendar Event');
      expect(notifs[0].link).toBe('/app/workspace/calendar');
      expect(notifs[0].metadata).toEqual({ eventId: 'event-555' });
      expect(notifs[0].read).toBe(false);
    });
  });
});
