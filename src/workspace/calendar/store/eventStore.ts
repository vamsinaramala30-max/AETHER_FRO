import { create } from 'zustand';
import { CalendarEvent } from '../types/event';
import { eventService } from '../services/eventService';

interface EventState {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  isEventFormOpen: boolean;
  isEventDetailsOpen: boolean;
  editingEvent: Partial<CalendarEvent> | null;
  historyStack: CalendarEvent[][]; // Undo history

  // Actions
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  openEventForm: (initialData?: Partial<CalendarEvent>) => void;
  closeEventForm: () => void;
  openEventDetails: (event: CalendarEvent) => void;
  closeEventDetails: () => void;
  undo: () => void;
}

const initialEvents: CalendarEvent[] = [
  // All day events
  {
    id: 'evt-all-day-1',
    calendarId: 'cal-ai',
    title: 'Product Roadmap',
    start: '2026-08-03T00:00:00.000Z',
    end: '2026-08-03T23:59:59.000Z',
    isAllDay: true,
    timeZone: 'UTC',
    color: '#059669', // Teal green
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-all-day-2',
    calendarId: 'cal-work',
    title: 'Design System Review',
    start: '2026-08-07T00:00:00.000Z',
    end: '2026-08-08T23:59:59.000Z',
    isAllDay: true,
    timeZone: 'UTC',
    color: '#7e22ce', // Dark Purple
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Monday events
  {
    id: 'evt-mon-1',
    calendarId: 'cal-personal',
    title: 'Team Standup',
    start: '2026-08-03T09:00:00.000Z',
    end: '2026-08-03T09:30:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-mon-2',
    calendarId: 'cal-work',
    title: 'Client Call',
    start: '2026-08-03T11:00:00.000Z',
    end: '2026-08-03T12:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#6b21a8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-mon-3',
    calendarId: 'cal-personal',
    title: 'Design Review',
    start: '2026-08-03T14:00:00.000Z',
    end: '2026-08-03T15:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-mon-4',
    calendarId: 'cal-work',
    title: 'Weekly Wrap-up',
    start: '2026-08-03T17:00:00.000Z',
    end: '2026-08-03T18:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#6b21a8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-mon-5',
    calendarId: 'cal-ai',
    title: 'Gym',
    start: '2026-08-03T18:00:00.000Z',
    end: '2026-08-03T19:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#047857',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Tuesday events
  {
    id: 'evt-tue-1',
    calendarId: 'cal-personal',
    title: 'Project Planning',
    start: '2026-08-04T10:00:00.000Z',
    end: '2026-08-04T11:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Wednesday events
  {
    id: 'evt-wed-1',
    calendarId: 'cal-work',
    title: 'AI Research Sync',
    start: '2026-08-05T09:00:00.000Z',
    end: '2026-08-05T10:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#6b21a8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-wed-2',
    calendarId: 'cal-ai',
    title: 'Lunch Break',
    start: '2026-08-05T12:00:00.000Z',
    end: '2026-08-05T13:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#047857',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-wed-3',
    calendarId: 'cal-personal',
    title: 'Marketing Sync',
    start: '2026-08-05T15:00:00.000Z',
    end: '2026-08-05T16:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Thursday events
  {
    id: 'evt-thu-1',
    calendarId: 'cal-reminders',
    title: 'Learning Time',
    start: '2026-08-06T14:00:00.000Z',
    end: '2026-08-06T15:30:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#9a3412',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Friday events
  {
    id: 'evt-fri-1',
    calendarId: 'cal-personal',
    title: 'Team Standup',
    start: '2026-08-07T09:00:00.000Z',
    end: '2026-08-07T09:30:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-fri-2',
    calendarId: 'cal-work',
    title: 'Product Review',
    start: '2026-08-07T13:00:00.000Z',
    end: '2026-08-07T14:00:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#6b21a8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-fri-3',
    calendarId: 'cal-personal',
    title: 'Dinner with Team',
    start: '2026-08-07T18:00:00.000Z',
    end: '2026-08-07T19:30:00.000Z',
    isAllDay: false,
    timeZone: 'UTC',
    color: '#1d4ed8',
    status: 'confirmed',
    visibility: 'default',
    organizer: {
      id: 'user-1',
      displayName: 'User',
      email: 'user@example.com',
      status: 'accepted',
      role: 'organizer',
    },
    participants: [],
    reminders: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useEventStore = create<EventState>((set, get) => ({
  events: initialEvents,
  selectedEvent: null,
  isEventFormOpen: false,
  isEventDetailsOpen: false,
  editingEvent: null,
  historyStack: [],

  setEvents: (events) => {
    set({ events });
  },

  addEvent: (event) => {
    set((state) => ({
      historyStack: [...state.historyStack, state.events],
      events: [...state.events, event],
    }));
    void eventService.createEvent(event);
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      historyStack: [...state.historyStack, state.events],
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e,
      ),
      selectedEvent:
        state.selectedEvent?.id === id
          ? { ...state.selectedEvent, ...updates }
          : state.selectedEvent,
    }));
    void eventService.updateEvent(id, updates);
  },

  deleteEvent: (id) => {
    set((state) => ({
      historyStack: [...state.historyStack, state.events],
      events: state.events.filter((e) => e.id !== id),
      selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
      isEventDetailsOpen: false,
    }));
    void eventService.deleteEvent(id);
  },

  setSelectedEvent: (selectedEvent) => {
    set({ selectedEvent });
  },

  openEventForm: (initialData) => {
    set({
      isEventFormOpen: true,
      editingEvent: initialData || null,
    });
  },

  closeEventForm: () => {
    set({
      isEventFormOpen: false,
      editingEvent: null,
    });
  },

  openEventDetails: (event) => {
    set({
      selectedEvent: event,
      isEventDetailsOpen: true,
    });
  },

  closeEventDetails: () => {
    set({
      isEventDetailsOpen: false,
      selectedEvent: null,
    });
  },

  undo: () => {
    const { historyStack } = get();
    if (historyStack.length === 0) return;
    const previousEvents = historyStack[historyStack.length - 1];
    set({
      events: previousEvents,
      historyStack: historyStack.slice(0, historyStack.length - 1),
    });
  },
}));
