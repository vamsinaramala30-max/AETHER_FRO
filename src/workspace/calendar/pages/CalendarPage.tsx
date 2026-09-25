import React, { useEffect } from 'react';
import '../styles/calendar.css';
import '../styles/events.css';
import '../styles/responsive.css';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarToolbar } from '../components/CalendarToolbar';
import { CalendarSidebar } from '../components/CalendarSidebar';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { AgendaView } from './AgendaView';
import { EventForm } from '../components/EventForm';
import { EventDetails } from '../components/EventDetails';
import { DragDropProvider } from '../drag-drop/DragDropProvider';
import { EventDragLayer } from '../drag-drop/EventDragLayer';
import { eventService } from '../services/eventService';
import { calendarService } from '../services/calendarService';
import { useEventStore } from '../store/eventStore';
import { useCalendarStore } from '../store/calendarStore';

export const CalendarPage: React.FC = () => {
  const { viewState } = useCalendar();
  const setEvents = useEventStore((state) => state.setEvents);
  const setCalendars = useCalendarStore((state) => state.setCalendars);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const loadBackendData = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [fetchedEvents, fetchedCalendars] = await Promise.all([
        eventService.fetchEvents(),
        calendarService.fetchCalendars(),
      ]);
      if (Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
      }
      if (Array.isArray(fetchedCalendars) && fetchedCalendars.length > 0) {
        setCalendars(fetchedCalendars);
      }
    } catch (err: any) {
      console.warn('[CalendarPage] Failed to fetch backend calendar data:', err);
      setLoadError(err?.message || 'Failed to load calendar events from server.');
    } finally {
      setIsLoading(false);
    }
  }, [setEvents, setCalendars]);

  useEffect(() => {
    let isMounted = true;
    void loadBackendData();
    return () => {
      isMounted = false;
    };
  }, [loadBackendData]);

  const renderActiveView = () => {
    switch (viewState.currentView) {
      case 'day':
        return <DayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      case 'year':
        return <YearView />;
      case 'agenda':
        return <AgendaView />;
      default:
        return <WeekView />;
    }
  };

  return (
    <DragDropProvider>
      <div className="calendar-page-layout">
        <CalendarToolbar />
        {loadError && (
          <div className="mx-4 my-2 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <span>⚠ {loadError}</span>
            <button
              type="button"
              onClick={() => void loadBackendData()}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        )}
        <div className="calendar-main-container">
          {viewState.isSidebarOpen && <CalendarSidebar />}
          <main className="calendar-content-view">{renderActiveView()}</main>
        </div>
        <EventForm />
        <EventDetails />
        <EventDragLayer />
      </div>
    </DragDropProvider>
  );
};
