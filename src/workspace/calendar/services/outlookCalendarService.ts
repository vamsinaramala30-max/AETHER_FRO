import { CalendarEvent } from '../types/event';

export const outlookCalendarService = {
  syncWithOutlook(): Promise<CalendarEvent[]> {
    // Integration boilerplate for Microsoft Graph API
    return Promise.resolve([]);
  },
};
