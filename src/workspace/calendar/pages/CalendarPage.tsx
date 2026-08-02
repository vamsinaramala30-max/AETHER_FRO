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

  useEffect(() => {
    let isMounted = true;
    const loadBackendData = async () => {
      try {
        const [fetchedEvents, fetchedCalendars] = await Promise.all([
          eventService.fetchEvents(),
          calendarService.fetchCalendars(),
        ]);
        if (isMounted) {
          if (fetchedEvents && fetchedEvents.length > 0) {
            setEvents(fetchedEvents);
          }
          if (fetchedCalendars && fetchedCalendars.length > 0) {
            setCalendars(fetchedCalendars);
          }
        }
      } catch (err) {
        console.warn('[CalendarPage] Failed to fetch backend calendar data:', err);
      }
    };
    void loadBackendData();
    return () => {
      isMounted = false;
    };
  }, [setEvents, setCalendars]);

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
