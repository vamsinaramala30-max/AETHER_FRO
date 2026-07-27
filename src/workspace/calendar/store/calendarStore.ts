import { create } from 'zustand';
import { Calendar, ViewState, CalendarViewType } from '../types/calendar';
import { getUserLocalTimeZone } from '../utils/timezoneUtils';

interface CalendarState {
  calendars: Calendar[];
  viewState: ViewState;
  selectedCalendarIds: string[];

  // Actions
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

const initialCalendars: Calendar[] = [
  {
    id: 'primary-1',
    title: 'Personal',
    color: '#039be5',
    isPrimary: true,
    isVisible: true,
    isCustom: false,
    accessLevel: 'owner',
    timeZone: getUserLocalTimeZone(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 'user-1',
    source: 'local',
  },
  {
    id: 'work-2',
    title: 'Work & Projects',
    color: '#7986cb',
    isPrimary: false,
    isVisible: true,
    isCustom: true,
    accessLevel: 'owner',
    timeZone: getUserLocalTimeZone(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerId: 'user-1',
    source: 'local',
  },
];

export const useCalendarStore = create<CalendarState>((set) => ({
  calendars: initialCalendars,
  selectedCalendarIds: initialCalendars.map((c) => c.id),
  viewState: {
    currentView: 'week',
    currentDate: new Date().toISOString().split('T')[0],
    selectedTimeZone: getUserLocalTimeZone(),
    isMiniCalendarOpen: true,
    isSidebarOpen: true,
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

      return {
        selectedCalendarIds: updatedIds,
        calendars: state.calendars.map((c) => (c.id === id ? { ...c, isVisible: !isVisible } : c)),
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
