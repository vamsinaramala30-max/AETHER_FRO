import { CalendarEvent, EventLocation } from '../types/event';
import { calendarApi } from '../../../api/calendar.api';

const mapLocationFromApi = (loc?: string | null): EventLocation | undefined => {
  if (!loc) return undefined;
  return { name: loc };
};

const mapLocationToApi = (loc?: EventLocation | string): string | undefined => {
  if (!loc) return undefined;
  if (typeof loc === 'string') return loc;
  return loc.name;
};

export const eventService = {
  async fetchEvents(): Promise<CalendarEvent[]> {
    const response = await calendarApi.getEvents();
    const items = response.data || [];
    return items.map((e) => {
      let parsedRecurrence = e.recurrenceRule;
      if (!parsedRecurrence && e.recurrence) {
        try {
          parsedRecurrence = JSON.parse(e.recurrence);
        } catch {
          parsedRecurrence = undefined;
        }
      }

      return {
        id: e.id,
        calendarId: e.calendarId || 'cal-personal',
        title: e.title,
        start: e.start,
        end: e.end,
        isAllDay: e.isAllDay,
        timeZone: 'UTC',
        location: mapLocationFromApi(e.location),
        color: e.color || '#38bdf8',
        status: (e.status || 'confirmed') as CalendarEvent['status'],
        visibility: 'default',
        recurrenceRule: parsedRecurrence,
        recurrenceId: undefined,
        taskId: e.taskId || undefined,
        projectId: e.projectId || undefined,
        organizer: {
          id: e.organizer?.id || '',
          displayName: e.organizer?.displayName || 'User',
          email: e.organizer?.email || '',
          role: 'organizer',
          status: 'accepted',
        },
        participants: [],
        reminders: [],
        attachments: [],
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
  },

  async saveEvents(_events: CalendarEvent[]): Promise<void> {
    // Backend DB is source of truth per item.
  },

  async createEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const response = await calendarApi.createEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      isAllDay: event.isAllDay,
      color: event.color,
      location: mapLocationToApi(event.location),
      description: event.description,
      calendarId: event.calendarId,
      taskId: (event as any).taskId,
      projectId: (event as any).projectId,
      recurrence: event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined,
      recurrenceRule: event.recurrenceRule,
    });
    const created = response.data;
    return {
      ...event,
      id: created.id,
      recurrenceRule: created.recurrenceRule || event.recurrenceRule,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await calendarApi.updateEvent(id, {
      title: updates.title,
      start: updates.start,
      end: updates.end,
      isAllDay: updates.isAllDay,
      color: updates.color,
      location: mapLocationToApi(updates.location),
      description: updates.description,
      calendarId: updates.calendarId,
      taskId: (updates as any).taskId,
      projectId: (updates as any).projectId,
      recurrence: updates.recurrenceRule ? JSON.stringify(updates.recurrenceRule) : undefined,
      recurrenceRule: updates.recurrenceRule,
    });
    const updatedBackend = response.data;
    return {
      id,
      calendarId: updates.calendarId || 'cal-personal',
      title: updatedBackend.title || updates.title || '',
      start: updatedBackend.start || updates.start || '',
      end: updatedBackend.end || updates.end || '',
      isAllDay: updatedBackend.isAllDay ?? updates.isAllDay ?? false,
      timeZone: updates.timeZone || 'UTC',
      color: updatedBackend.color || updates.color || '#38bdf8',
      status: (updatedBackend.status || 'confirmed') as CalendarEvent['status'],
      visibility: updates.visibility || 'default',
      recurrenceRule: updatedBackend.recurrenceRule || updates.recurrenceRule,
      organizer: updates.organizer || {
        id: '',
        displayName: '',
        email: '',
        role: 'organizer',
        status: 'accepted',
      },
      participants: updates.participants || [],
      reminders: updates.reminders || [],
      attachments: updates.attachments || [],
      createdAt: updates.createdAt || new Date().toISOString(),
      updatedAt: updatedBackend.updatedAt || new Date().toISOString(),
    };
  },

  async deleteEvent(id: string): Promise<void> {
    await calendarApi.deleteEvent(id);
  },
};
