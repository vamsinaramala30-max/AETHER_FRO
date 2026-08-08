import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useCalendarStore } from '../store/calendarStore';
import { useNotificationStore } from '@/state/notificationStore';
import { CalendarEvent } from '../types/event';
import { validateCalendarEvent } from '../utils/validation';
import { EventColorPicker } from './EventColorPicker';
import { RecurringEventEditor } from './RecurringEventEditor';
import { ParticipantSelector } from './ParticipantSelector';
import { EventAttachments } from './EventAttachments';
import { EventReminder } from './EventReminder';
import { X, Calendar as CalendarIcon, Clock, MapPin, AlignLeft, Tag } from 'lucide-react';

const formatIsoToDateStr = (isoStr?: string): string => {
  if (!isoStr) return new Date().toISOString().substring(0, 10);
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return new Date().toISOString().substring(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatIsoToTimeStr = (isoStr?: string): string => {
  if (!isoStr) return '09:00';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '09:00';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const buildDateTimeObj = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0);
};

export const EventForm: React.FC = () => {
  const { isEventFormOpen, editingEvent, closeEventForm, addEvent, updateEvent } = useEventStore();
  const { calendars, viewState } = useCalendarStore();

  const primaryCal = calendars[0]?.id ?? 'cal-work';

  const [title, setTitle] = useState(editingEvent?.title ?? '');
  const [description, setDescription] = useState(editingEvent?.description ?? '');
  const [calendarId, setCalendarId] = useState(editingEvent?.calendarId ?? primaryCal);

  const [isAllDay, setIsAllDay] = useState(editingEvent?.isAllDay === true);
  const [startDate, setStartDate] = useState(formatIsoToDateStr(editingEvent?.start));
  const [startTime, setStartTime] = useState(formatIsoToTimeStr(editingEvent?.start));
  const [endDate, setEndDate] = useState(formatIsoToDateStr(editingEvent?.end));
  const [endTime, setEndTime] = useState(
    editingEvent?.end ? formatIsoToTimeStr(editingEvent.end) : '10:00',
  );

  const [color, setColor] = useState(editingEvent?.color ?? '#039be5');
  const [locationName, setLocationName] = useState(editingEvent?.location?.name ?? '');
  const [recurrenceRule, setRecurrenceRule] = useState(editingEvent?.recurrenceRule);
  const [participants, setParticipants] = useState(editingEvent?.participants ?? []);
  const [attachments, setAttachments] = useState(editingEvent?.attachments ?? []);
  const [reminders, setReminders] = useState(editingEvent?.reminders ?? []);
  const [errors, setErrors] = useState<string[]>([]);

  if (!isEventFormOpen) return null;

  // Synchronization helper on start change
  const handleStartDateChange = (newDateStr: string) => {
    setStartDate(newDateStr);
    const startDt = buildDateTimeObj(newDateStr, startTime);
    const endDt = buildDateTimeObj(endDate, endTime);
    if (startDt > endDt) {
      setEndDate(newDateStr);
      if (!isAllDay) {
        const autoEndDt = new Date(startDt.getTime() + 3600000);
        setEndTime(formatIsoToTimeStr(autoEndDt.toISOString()));
      }
    }
  };

  const handleStartTimeChange = (newTimeStr: string) => {
    setStartTime(newTimeStr);
    const startDt = buildDateTimeObj(startDate, newTimeStr);
    const endDt = buildDateTimeObj(endDate, endTime);
    if (startDt >= endDt) {
      const autoEndDt = new Date(startDt.getTime() + 3600000);
      setEndDate(formatIsoToDateStr(autoEndDt.toISOString()));
      setEndTime(formatIsoToTimeStr(autoEndDt.toISOString()));
    }
  };

  const handleEndDateChange = (newDateStr: string) => {
    setEndDate(newDateStr);
    const startDt = buildDateTimeObj(startDate, startTime);
    const endDt = buildDateTimeObj(newDateStr, endTime);
    if (endDt < startDt) {
      setStartDate(newDateStr);
    }
  };

  const handleEndTimeChange = (newTimeStr: string) => {
    setEndTime(newTimeStr);
    const startDt = buildDateTimeObj(startDate, startTime);
    const endDt = buildDateTimeObj(endDate, newTimeStr);
    if (endDt <= startDt) {
      const autoStartDt = new Date(endDt.getTime() - 3600000);
      setStartDate(formatIsoToDateStr(autoStartDt.toISOString()));
      setStartTime(formatIsoToTimeStr(autoStartDt.toISOString()));
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const startObj = isAllDay
      ? buildDateTimeObj(startDate, '00:00')
      : buildDateTimeObj(startDate, startTime);
    const endObj = isAllDay
      ? buildDateTimeObj(endDate, '23:59')
      : buildDateTimeObj(endDate, endTime);

    if (endObj < startObj) {
      setErrors(['End date & time must be after start date & time.']);
      return;
    }

    const payload: Partial<CalendarEvent> = {
      ...editingEvent,
      title: title.trim() !== '' ? title : 'Untitled Event',
      description,
      calendarId,
      start: startObj.toISOString(),
      end: endObj.toISOString(),
      isAllDay,
      color,
      location: locationName.trim() !== '' ? { name: locationName } : undefined,
      recurrenceRule,
      participants,
      attachments,
      reminders,
      timeZone: viewState.selectedTimeZone || 'UTC',
      status: 'confirmed',
      visibility: 'default',
      organizer: editingEvent?.organizer || {
        id: 'usr_1',
        email: 'user@enterprise.com',
        displayName: 'Current User',
        status: 'accepted',
        role: 'organizer',
      },
      createdAt:
        typeof editingEvent?.createdAt === 'string'
          ? editingEvent.createdAt
          : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const valErrors = validateCalendarEvent(payload);
    if (valErrors.length > 0) {
      setErrors(valErrors.map((err) => err.message));
      return;
    }

    if (typeof editingEvent?.id === 'string' && editingEvent.id.trim() !== '') {
      updateEvent(editingEvent.id, payload);
      useNotificationStore.getState().addNotification({
        title: 'Calendar Event Updated',
        description: `Event "${payload.title}" was updated.`,
        type: 'calendar',
      });
    } else {
      addEvent({ ...payload, id: `evt_${String(Date.now())}` } as CalendarEvent);
      useNotificationStore.getState().addNotification({
        title: 'Calendar Event Created',
        description: `Event "${payload.title}" scheduled for ${startDate}.`,
        type: 'calendar',
      });
    }

    closeEventForm();
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs"
      onClick={closeEventForm}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {typeof editingEvent?.id === 'string' && editingEvent.id.trim() !== ''
              ? 'Edit Event'
              : 'Create Event'}
          </h2>
          <button
            type="button"
            onClick={closeEventForm}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {errors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Add event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Calendar Picker & All-day Toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Calendar
              </label>
              <select
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {calendars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 pt-4 sm:pt-6 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              All day event
            </label>
          </div>

          {/* Separate Date & Time Pickers */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            {/* Start Row */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                Start Date & Time
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {!isAllDay && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* End Row */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                End Date & Time
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {!isAllDay && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Tag className="h-3.5 w-3.5 text-indigo-500" />
              Event Color
            </label>
            <EventColorPicker selectedColor={color} onSelectColor={setColor} />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Add location or link..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Description
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <textarea
                placeholder="Add event notes or description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Recurrence Editor */}
          <RecurringEventEditor rule={recurrenceRule} onChange={setRecurrenceRule} />

          {/* Participants */}
          <ParticipantSelector
            participants={participants}
            onAddParticipant={(p) => setParticipants([...participants, p])}
            onRemoveParticipant={(id) => setParticipants(participants.filter((p) => p.id !== id))}
          />

          {/* Reminders */}
          <EventReminder
            reminders={reminders}
            onAddReminder={(r) => setReminders([...reminders, r])}
            onUpdateReminder={(id, minutesBefore) => {
              setReminders(
                reminders.map((rem) => (rem.id === id ? { ...rem, minutesBefore } : rem)),
              );
            }}
            onRemoveReminder={(id) => setReminders(reminders.filter((r) => r.id !== id))}
          />

          {/* Attachments */}
          <EventAttachments
            attachments={attachments}
            onAddAttachment={(att) => setAttachments([...attachments, att])}
            onRemoveAttachment={(id) => setAttachments(attachments.filter((a) => a.id !== id))}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={closeEventForm}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
