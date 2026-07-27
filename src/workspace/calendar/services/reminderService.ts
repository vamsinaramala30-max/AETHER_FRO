import { CalendarEvent } from '../types/event';
import { ScheduledReminderNotification } from '../types/reminder';

export const reminderService = {
  calculateReminders(event: CalendarEvent): ScheduledReminderNotification[] {
    if (!Array.isArray(event.reminders) || event.reminders.length === 0) return [];

    const eventStartTime = new Date(event.start).getTime();

    return event.reminders.map((reminder) => {
      const triggerTimeMs = eventStartTime - reminder.minutesBefore * 60 * 1000;
      return {
        id: `rem_${event.id}_${reminder.id}`,
        eventId: event.id,
        eventTitle: event.title,
        triggerTime: new Date(triggerTimeMs).toISOString(),
        method: reminder.method,
        isDelivered: false,
      };
    });
  },
};
