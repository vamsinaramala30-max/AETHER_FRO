// frontend/src/workspace/calendar/EventForm.tsx
import React, { useState } from 'react';
import { CalendarEventData } from './calendarService';

interface EventFormProps {
  initialEvent?: CalendarEventData | null;
  selectedDate: Date;
  onSubmit: (event: Omit<CalendarEventData, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialEvent,
  selectedDate,
  onSubmit,
  onCancel,
  onDelete
}) => {
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [dateStr, setDateStr] = useState(initialEvent ? formatDateString(new Date(initialEvent.startTime)) : formatDateString(selectedDate));
  const [startTimeStr, setStartTimeStr] = useState(initialEvent ? formatTime(new Date(initialEvent.startTime)) : '09:00');
  const [endTimeStr, setEndTimeStr] = useState(initialEvent ? formatTime(new Date(initialEvent.endTime)) : '10:00');
  const [color, setColor] = useState(initialEvent?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const start = new Date(`${dateStr}T${startTimeStr}`);
    const end = new Date(`${dateStr}T${endTimeStr}`);

    onSubmit({
      ...(initialEvent?.id ? { id: initialEvent.id } : {}),
      title: title.trim(),
      description: description.trim(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      color,
      isAllDay: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); }}
          placeholder="Design Review Session"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          placeholder="Add operational details..."
          rows={3}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Date</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => { setDateStr(e.target.value); }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Start Time</label>
          <input
            type="time"
            value={startTimeStr}
            onChange={(e) => { setStartTimeStr(e.target.value); }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">End Time</label>
          <input
            type="time"
            value={endTimeStr}
            onChange={(e) => { setEndTimeStr(e.target.value); }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Accent Theme</label>
        <div className="flex items-center gap-3 mt-1">
          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setColor(c); }}
              className={`w-6 h-6 rounded-full border transition-transform ${color === c ? 'scale-110 border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-800">
        {initialEvent?.id && onDelete ? (
          <button
            type="button"
            onClick={() => { onDelete(initialEvent.id); }}
            className="w-full sm:w-auto px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-400 rounded-lg transition-colors text-xs font-medium"
          >
            Delete Event
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {initialEvent ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </form>
  );
};