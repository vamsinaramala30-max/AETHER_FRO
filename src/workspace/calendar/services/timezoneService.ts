import { COMMON_TIMEZONES, TimeZoneOption } from '../utils/timezoneUtils';

export const timezoneService = {
  getTimeZones(): TimeZoneOption[] {
    return COMMON_TIMEZONES;
  },

  getTimeZoneByValue(value: string): TimeZoneOption | undefined {
    return COMMON_TIMEZONES.find((tz) => tz.value === value);
  },
};
