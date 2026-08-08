import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { useEventStore } from '../store/eventStore';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export const AgendaView: React.FC = () => {
  const { events } = useEvents();
  const { openEventDetails, openEventForm } = useEventStore();

  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white p-3 text-slate-900 dark:bg-slate-900 dark:text-slate-100 sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">Schedule Agenda</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {sorted.length} upcoming events scheduled
          </p>
        </div>
        <button
          type="button"
          onClick={() => openEventForm()}
          className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <Calendar className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Events Scheduled
          </h3>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            Your schedule is clean. Tap below to create your first event.
          </p>
          <button
            type="button"
            onClick={() => openEventForm()}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500"
          >
            + Create Event
          </button>
        </div>
      ) : (
        <div className="max-w-3xl space-y-3">
          {sorted.map((e) => {
            const startDate = new Date(e.start);
            const endDate = new Date(e.end);

            const dateStr = startDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            const timeStr = e.isAllDay
              ? 'All Day'
              : `${startDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - ${endDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`;

            return (
              <div
                key={e.id}
                onClick={() => openEventDetails(e)}
                className="dark:bg-slate-850 group relative flex cursor-pointer flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 transition-all hover:border-indigo-300 hover:bg-indigo-50/20 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-700/50 dark:hover:bg-indigo-950/20 sm:flex-row sm:items-center sm:p-4"
              >
                {/* Color Strip */}
                <div
                  className="absolute bottom-3 left-0 top-3 w-1.5 rounded-r-full"
                  style={{ backgroundColor: e.color || '#6366f1' }}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-2 pl-3 sm:flex-row sm:items-center sm:gap-4">
                  {/* Date Badge */}
                  <div className="shadow-2xs flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{dateStr}</span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {e.title}
                    </h4>
                    {typeof e.description === 'string' && e.description.trim() !== '' && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                        {e.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Metadata */}
                <div className="flex shrink-0 flex-wrap items-center gap-3 pl-3 text-xs text-slate-500 dark:text-slate-400 sm:pl-0">
                  {typeof e.location?.name === 'string' && e.location.name.trim() !== '' && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="max-w-[120px] truncate">{e.location.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{timeStr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
