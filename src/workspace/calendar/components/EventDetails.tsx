import React from 'react';
import { useEventStore } from '../store/eventStore';
import { formatInTimeZone } from '../utils/timezoneUtils';
import { Clock, MapPin, Edit3, Trash2, X, AlignLeft } from 'lucide-react';

export const EventDetails: React.FC = () => {
  const { selectedEvent, isEventDetailsOpen, closeEventDetails, deleteEvent, openEventForm } =
    useEventStore();

  if (!isEventDetailsOpen || !selectedEvent) return null;

  const formattedStart = formatInTimeZone(new Date(selectedEvent.start), selectedEvent.timeZone);

  return (
    <div
      className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-[1100] flex items-end justify-center bg-black/60 p-0 duration-200 sm:items-center sm:p-4"
      onClick={closeEventDetails}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:rounded-3xl sm:p-6"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Mobile Pull Indicator */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700 sm:hidden" />

        {/* Top Header & Actions */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="shadow-xs h-3.5 w-3.5 shrink-0 rounded-full"
              style={{ backgroundColor: selectedEvent.color || '#6366f1' }}
            />
            <h2 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
              {selectedEvent.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => {
                closeEventDetails();
                openEventForm(selectedEvent);
              }}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                deleteEvent(selectedEvent.id);
                closeEventDetails();
              }}
              className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={closeEventDetails}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Time Info */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>{formattedStart}</span>
        </div>

        {/* Location Info */}
        {typeof selectedEvent.location?.name === 'string' &&
          selectedEvent.location.name.trim() !== '' && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{selectedEvent.location.name}</span>
            </div>
          )}

        {/* Description */}
        {typeof selectedEvent.description === 'string' &&
          selectedEvent.description.trim() !== '' && (
            <div className="dark:bg-slate-850 mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <AlignLeft className="h-3.5 w-3.5 text-indigo-500" />
                <span>Description</span>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {selectedEvent.description}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
