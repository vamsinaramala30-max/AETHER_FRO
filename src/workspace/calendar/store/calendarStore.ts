import { create } from 'zustand';
import { Calendar, ViewState, CalendarViewType } from '../types/calendar';
import { calendarService } from '../services/calendarService';

interface CalendarState {
  calendars: Calendar[];
  viewState: ViewState;
  selectedCalendarIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCalendars: () => Promise<void>;
  setCalendars: (calendars: Calendar[]) => void;
  addCalendar: (calendar: Calendar) => void;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  deleteCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;

  // View State Actions
  setCurrentView: (view: CalendarViewType) => void;
  setCurrentDate: (date: string) => void;
  setSelectedTimeZone: (timeZone: string) => void;
  toggleMiniCalendar: () => void;
  toggleSidebar: () => void;
}

export const useCalendarStore = create<CalendarState>((set, _get) => ({
  calendars: [],
  selectedCalendarIds: [],
  isLoading: false,
  error: null,
  viewState: {
    currentView: 'week',
    currentDate: new Date().toISOString().split('T')[0],
    selectedTimeZone: '(UTC+00:00) UTC',
    isMiniCalendarOpen: true,
    isSidebarOpen: true,
  },

  fetchCalendars: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetched = await calendarService.fetchCalendars();
      set({
        calendars: fetched,
        selectedCalendarIds: fetched.filter((c) => c.isVisible).map((c) => c.id),
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch calendars',
        isLoading: false,
      });
    }
  },

  setCalendars: (calendars) => {
    set({
      calendars,
      selectedCalendarIds: calendars.filter((c) => c.isVisible).map((c) => c.id),
    });
  },

  addCalendar: (calendar) => {
    set((state) => ({
      calendars: [...state.calendars, calendar],
      selectedCalendarIds: [...state.selectedCalendarIds, calendar.id],
    }));
  },

  updateCalendar: (id, updates) => {
    set((state) => ({
      calendars: state.calendars.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  deleteCalendar: (id) => {
    set((state) => ({
      calendars: state.calendars.filter((c) => c.id !== id),
      selectedCalendarIds: state.selectedCalendarIds.filter((cId) => cId !== id),
    }));
  },

  toggleCalendarVisibility: (id) => {
    set((state) => {
      const isVisible = state.selectedCalendarIds.includes(id);
      const updatedIds = isVisible
        ? state.selectedCalendarIds.filter((cId) => cId !== id)
        : [...state.selectedCalendarIds, id];

      const updatedCalendars = state.calendars.map((c) =>
        c.id === id ? { ...c, isVisible: !isVisible } : c,
      );

      void calendarService.saveCalendars(updatedCalendars);

      return {
        selectedCalendarIds: updatedIds,
        calendars: updatedCalendars,
      };
    });
  },

  setCurrentView: (currentView) => {
    set((state) => ({
      viewState: { ...state.viewState, currentView },
    }));
  },

  setCurrentDate: (currentDate) => {
    set((state) => ({
      viewState: { ...state.viewState, currentDate },
    }));
  },

  setSelectedTimeZone: (selectedTimeZone) => {
    set((state) => ({
      viewState: { ...state.viewState, selectedTimeZone },
    }));
  },

  toggleMiniCalendar: () => {
    set((state) => ({
      viewState: { ...state.viewState, isMiniCalendarOpen: !state.viewState.isMiniCalendarOpen },
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      viewState: { ...state.viewState, isSidebarOpen: !state.viewState.isSidebarOpen },
    }));
  },
}));
