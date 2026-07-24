export type ReminderMethod = 'popup' | 'email' | 'push' | 'sms';

export interface EventReminder {
  id: string;
  method: ReminderMethod;
  minutesBefore: number; // e.g., 10, 15, 60, 1440 (1 day)
}

export interface ScheduledReminderNotification {
  id: string;
  eventId: string;
  eventTitle: string;
  triggerTime: string; // ISO timestamp
  method: ReminderMethod;
  isDelivered: boolean;
}