import { useCalendarStore } from '../store/calendarStore';

export const useCalendar = () => {
  const {
    calendars,
    selectedCalendarIds,
    viewState,
    setCurrentView,
    setCurrentDate,
    setSelectedTimeZone,
    toggleCalendarVisibility,
    toggleMiniCalendar,
    toggleSidebar,
  } = useCalendarStore();

  return {
    calendars,
    selectedCalendarIds,
    viewState,
    setCurrentView,
    setCurrentDate,
    setSelectedTimeZone,
    toggleCalendarVisibility,
    toggleMiniCalendar,
    toggleSidebar,
  };
};
