import { CalendarEvent } from '../types/event';

export const appleCalendarService = {
  syncWithiCloud(): Promise<CalendarEvent[]> {
    // Integration boilerplate for CalDAV / Apple iCloud
    return Promise.resolve([]);
  },
};
