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

const initialEvents: CalendarEvent[] = [];

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
