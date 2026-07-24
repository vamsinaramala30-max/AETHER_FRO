export interface TimeZoneOption {
  value: string; // e.g., 'America/New_York'
  label: string; // e.g., '(GMT-05:00) Eastern Time'
  offsetMinutes: number;
}

export const COMMON_TIMEZONES: TimeZoneOption[] = [
  { value: 'UTC', label: '(UTC+00:00) UTC', offsetMinutes: 0 },
  { value: 'America/New_York', label: '(UTC-05:00) Eastern Time (US & Canada)', offsetMinutes: -300 },
  { value: 'America/Chicago', label: '(UTC-06:00) Central Time (US & Canada)', offsetMinutes: -360 },
  { value: 'America/Denver', label: '(UTC-07:00) Mountain Time (US & Canada)', offsetMinutes: -420 },
  { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time (US & Canada)', offsetMinutes: -480 },
  { value: 'Europe/London', label: '(UTC+00:00) London, Edinburgh, Dublin', offsetMinutes: 0 },
  { value: 'Europe/Paris', label: '(UTC+01:00) Paris, Berlin, Rome, Madrid', offsetMinutes: 60 },
  { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo, Osaka, Sapporo', offsetMinutes: 540 },
  { value: 'Asia/Kolkata', label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', offsetMinutes: 330 },
  { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney, Melbourne, Canberra', offsetMinutes: 600 },
];

export const getUserLocalTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
};

export const formatInTimeZone = (date: Date, timeZone: string, locale = 'en-US'): string => {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(date);
  } catch (error) {
    console.warn(`Invalid timezone: ${timeZone}, falling back to UTC`, error);
    return date.toISOString();
  }
};

export const convertToTimeZone = (date: Date, timeZone: string): Date => {
  const dateString = date.toLocaleString('en-US', { timeZone });
  return new Date(dateString);
};