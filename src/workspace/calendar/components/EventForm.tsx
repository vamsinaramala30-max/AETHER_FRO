import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useCalendarStore } from '../store/calendarStore';
import { CalendarEvent } from '../types/event';
import { validateCalendarEvent } from '../utils/validation';
import { EventColorPicker } from './EventColorPicker';
import { RecurringEventEditor } from './RecurringEventEditor';
import { ParticipantSelector } from './ParticipantSelector';
import { EventAttachments } from './EventAttachments';
import { EventReminder } from './EventReminder';

export const EventForm: React.FC = () => {
  const { isEventFormOpen, editingEvent, closeEventForm, addEvent, updateEvent } = useEventStore();
  const { calendars, viewState } = useCalendarStore();

  const primaryCal = calendars[0]?.id || '';

  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [calendarId, setCalendarId] = useState(editingEvent?.calendarId || primaryCal);
  const [start, setStart] = useState(
    editingEvent?.start ? editingEvent.start.substring(0, 16) : new Date().toISOString().substring(0, 16)
  );
  const [end, setEnd] = useState(
    editingEvent?.end ? editingEvent.end.substring(0, 16) : new Date(Date.now() + 3600000).toISOString().substring(0, 16)
  );
  const [isAllDay, setIsAllDay] = useState(editingEvent?.isAllDay || false);
  const [color, setColor] = useState(editingEvent?.color || '#039be5');
  const [locationName, setLocationName] = useState(editingEvent?.location?.name || '');
  const [recurrenceRule, setRecurrenceRule] = useState(editingEvent?.recurrenceRule);
  const [participants, setParticipants] = useState(editingEvent?.participants || []);
  const [attachments, setAttachments] = useState(editingEvent?.attachments || []);
  const [reminders, setReminders] = useState(editingEvent?.reminders || []);
  const [errors, setErrors] = useState<string[]>([]);

  if (!isEventFormOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<CalendarEvent> = {
      ...editingEvent,
      title,
      description,
      calendarId,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      isAllDay,
      color,
      location: locationName ? { name: locationName } : undefined,
      recurrenceRule,
      participants,
      attachments,
      reminders,
      timeZone: viewState.selectedTimeZone,
      status: 'confirmed',
      visibility: 'default',
      organizer: { id: 'usr_1', email: 'user@enterprise.com', displayName: 'Current User', status: 'accepted', role: 'organizer' },
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const valErrors = validateCalendarEvent(payload);
    if (valErrors.length > 0) {
      setErrors(valErrors.map((err) => err.message));
      return;
    }

    if (editingEvent?.id) {
      updateEvent(editingEvent.id, payload);
    } else {
      addEvent({ ...payload, id: `evt_${Date.now()}` } as CalendarEvent);
    }

    closeEventForm();
  };

  return (
    <div className="modal-overlay" onClick={closeEventForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginTop: 0 }}>{editingEvent?.id ? 'Edit Event' : 'Create Event'}</h2>

          {errors.length > 0 && (
            <div style={{ color: '#d93025', marginBottom: '12px', fontSize: '13px' }}>
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Add title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ flex: 1, padding: '6px' }}
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ flex: 1, padding: '6px' }}
            />
          </div>

          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />
            All day
          </label>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Calendar</label>
            <select
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            >
              {calendars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <EventColorPicker selectedColor={color} onSelectColor={setColor} />

          <input
            type="text"
            placeholder="Add location..."
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            style={{ width: '100%', padding: '6px', marginTop: '12px', boxSizing: 'border-box' }}
          />

          <textarea
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '6px', marginTop: '12px', boxSizing: 'border-box' }}
          />

          <RecurringEventEditor rule={recurrenceRule} onChange={setRecurrenceRule} />

          <ParticipantSelector
            participants={participants}
            onAddParticipant={(p) => setParticipants([...participants, p])}
            onRemoveParticipant={(id) => setParticipants(participants.filter((p) => p.id !== id))}
          />

          <EventReminder
            reminders={reminders}
            onAddReminder={(r) => setReminders([...reminders, r])}
            onRemoveReminder={(id) => setReminders(reminders.filter((r) => r.id !== id))}
          />

          <EventAttachments
            attachments={attachments}
            onAddAttachment={(att) => setAttachments([...attachments, att])}
            onRemoveAttachment={(id) => setAttachments(attachments.filter((a) => a.id !== id))}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button type="button" onClick={closeEventForm} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#1a73e8', color: '#fff', border: 'none' }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};