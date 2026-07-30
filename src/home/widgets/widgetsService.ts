export interface WeatherData {
  temperature: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Snow';
  location: string;
  high: number;
  low: number;
}

export interface FocusTimerData {
  currentSessionMinutes: number;
  totalGoalMinutes: number;
  isTimerActive: boolean;
}

export interface CalendarSummaryData {
  totalMeetingsToday: number;
  nextMeetingInMinutes: number;
  freeSlotsCount: number;
}

export async function fetchWidgetData(): Promise<{
  weather: WeatherData;
  focus: FocusTimerData;
  calendar: CalendarSummaryData;
}> {
  return {
    weather: {
      temperature: 72,
      condition: 'Partly Cloudy',
      location: 'San Francisco, CA',
      high: 76,
      low: 58,
    },
    focus: {
      currentSessionMinutes: 45,
      totalGoalMinutes: 120,
      isTimerActive: true,
    },
    calendar: {
      totalMeetingsToday: 4,
      nextMeetingInMinutes: 15,
      freeSlotsCount: 3,
    },
  };
}