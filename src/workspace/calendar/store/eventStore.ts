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
  addEvent: (event: CalendarEvent) => Promise<CalendarEvent>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteEvent: (id: string) => Promise<void>;
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

  addEvent: async (event) => {
    const tempId = event.id;
    set((state) => ({
      historyStack: [...state.historyStack, state.events],
      events: [...state.events, event],
    }));
    try {
      const persisted = await eventService.createEvent(event);
      set((state) => ({
        events: state.events.map((e) => (e.id === tempId ? persisted : e)),
        selectedEvent: state.selectedEvent?.id === tempId ? persisted : state.selectedEvent,
      }));
      return persisted;
    } catch (error) {
      set((state) => ({
        events: state.events.filter((e) => e.id !== tempId),
        selectedEvent: state.selectedEvent?.id === tempId ? null : state.selectedEvent,
      }));
      throw error;
    }
  },

  updateEvent: async (id, updates) => {
    const previousEvents = get().events;
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
    try {
      const updated = await eventService.updateEvent(id, updates);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updated : e)),
        selectedEvent: state.selectedEvent?.id === id ? updated : state.selectedEvent,
      }));
      return updated;
    } catch (error) {
      set({ events: previousEvents });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    const previousEvents = get().events;
    set((state) => ({
      historyStack: [...state.historyStack, state.events],
      events: state.events.filter((e) => e.id !== id),
      selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
      isEventDetailsOpen: false,
    }));
    try {
      await eventService.deleteEvent(id);
    } catch (error) {
      set({ events: previousEvents });
      throw error;
    }
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
