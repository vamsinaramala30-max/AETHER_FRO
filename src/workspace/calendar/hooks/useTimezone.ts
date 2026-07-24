import { useCalendarStore } from '../store/calendarStore';
import { TimezoneService } from '../services/timezoneService';

export const useTimezone = () => {
  const { viewState, setSelectedTimeZone } = useCalendarStore();
  const timeZones = TimezoneService.getTimeZones();

  return {
    currentTimeZone: viewState.selectedTimeZone,
    timeZones,
    setTimeZone: setSelectedTimeZone,
  };
};