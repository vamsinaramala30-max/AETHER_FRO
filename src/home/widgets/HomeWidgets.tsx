import React, { useEffect, useState } from 'react';
import {
  fetchWidgetData,
  WeatherData,
  FocusTimerData,
  CalendarSummaryData,
} from './widgetsService';
import { WeatherWidget } from './WeatherWidget';
import { CalendarWidget } from './CalendarWidget';
import { FocusWidget } from './FocusWidget';

export const HomeWidgets: React.FC = () => {
  const [data, setData] = useState<{
    weather: WeatherData;
    focus: FocusTimerData;
    calendar: CalendarSummaryData;
  } | null>(null);

  useEffect(() => {
    fetchWidgetData().then(setData);
  }, []);

  if (!data) return null;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <WeatherWidget weather={data.weather} />
      <CalendarWidget calendar={data.calendar} />
      <FocusWidget focus={data.focus} />
    </section>
  );
};
