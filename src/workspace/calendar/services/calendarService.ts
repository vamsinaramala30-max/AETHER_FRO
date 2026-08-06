import { Calendar } from '../types/calendar';
import { calendarApi } from '../../../api/calendar.api';

export const calendarService = {
  async fetchCalendars(): Promise<Calendar[]> {
    const response = await calendarApi.getCalendars();
    const items = response.data || [];
    return items.map((c) => ({
      id: c.id,
      title: c.title,
      color: c.color,
      isPrimary: c.isPrimary,
      isVisible: c.isVisible,
      isCustom: !c.isPrimary,
      accessLevel: (c.accessLevel || 'owner') as Calendar['accessLevel'],
      timeZone: c.timeZone || 'UTC',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      ownerId: c.ownerId,
      source: 'local',
    }));
  },

  async saveCalendars(calendars: Calendar[]): Promise<void> {
    await Promise.all(
      calendars.map((c) =>
        calendarApi.updateCalendar(c.id, {
          title: c.title,
          color: c.color,
          isVisible: c.isVisible,
          timeZone: c.timeZone,
        }),
      ),
    );
  },
};
