import React from 'react';
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

export const CalendarPage: React.FC = () => {
  const { viewState } = useCalendar();

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
