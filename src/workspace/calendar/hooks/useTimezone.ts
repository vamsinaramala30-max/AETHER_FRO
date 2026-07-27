import { useCalendarStore } from '../store/calendarStore';
import { timezoneService } from '../services/timezoneService';

export const useTimezone = () => {
  const { viewState, setSelectedTimeZone } = useCalendarStore();
  const timeZones = timezoneService.getTimeZones();

  return {
    currentTimeZone: viewState.selectedTimeZone,
    timeZones,
    setTimeZone: setSelectedTimeZone,
  };
};
