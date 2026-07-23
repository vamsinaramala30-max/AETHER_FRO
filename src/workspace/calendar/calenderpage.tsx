// frontend/src/workspace/calendar/CalendarPage.tsx
import React, { useState, useEffect } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { EventForm } from './EventForm';
import { calendarService, CalendarEventData } from './calendarService';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State Orchestration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeEvent, setActiveEvent] = useState<CalendarEventData | null>(null);

  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await calendarService.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to operationalize structural calendar matrix elements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setActiveEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEventData) => {
    setActiveEvent(event);
    setSelectedDate(new Date(event.startTime));
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: Omit<CalendarEventData, 'id'> & { id?: string }) => {
    try {
      if (formData.id) {
        await calendarService.updateEvent(formData.id, formData);
      } else {
        await calendarService.createEvent(formData);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setError('Could not push atomic structural modifications safely to memory runtime.');
    }
  };

  const handleEventDelete = async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setError('Event deletion failed.');
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Workspace Engine Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">Orchestrate operational schedules, team review sprints, and workspace deployments.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 border border-slate-800 rounded-lg shadow-inner self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold font-mono tracking-wide px-4 min-w-[120px] text-center">
            {monthName} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-sm text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono tracking-wider">SYNCHRONIZING TIMELINE MATRIX...</span>
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onSelectDay={handleSelectDay}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {/* Dynamic Workspace Modal Context Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold tracking-tight text-white">
                {activeEvent ? 'Modify Workspace Event' : 'Schedule New Event Slot'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EventForm
              initialEvent={activeEvent}
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={() => { setIsModalOpen(false); }}
              onDelete={handleEventDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};