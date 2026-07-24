import { COMMON_TIMEZONES, TimeZoneOption } from '../utils/timezoneUtils';

export class TimezoneService {
  public static getTimeZones(): TimeZoneOption[] {
    return COMMON_TIMEZONES;
  }

  public static getTimeZoneByValue(value: string): TimeZoneOption | undefined {
    return COMMON_TIMEZONES.find(tz => tz.value === value);
  }
}