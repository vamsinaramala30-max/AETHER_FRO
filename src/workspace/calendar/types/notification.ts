export type NotificationType = 
  | 'event_invitation'
  | 'event_update'
  | 'event_cancelled'
  | 'reminder'
  | 'sync_conflict'
  | 'system_alert';

export interface CalendarNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  eventId?: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationSettings {
  enableDesktopNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSoundAlerts: boolean;
  defaultReminderMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
}