import React from 'react';
import { useEventStore } from '../store/eventStore';
import { formatInTimeZone } from '../utils/timezoneUtils';

export const EventDetails: React.FC = () => {
  const { selectedEvent, isEventDetailsOpen, closeEventDetails, deleteEvent, openEventForm } =
    useEventStore();

  if (!isEventDetailsOpen || !selectedEvent) return null;

  const formattedStart = formatInTimeZone(new Date(selectedEvent.start), selectedEvent.timeZone);

  return (
    <div className="modal-overlay" onClick={closeEventDetails}>
      <div
        className="modal-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedEvent.title}</h2>
          <div>
            <button
              type="button"
              onClick={() => {
                closeEventDetails();
                openEventForm(selectedEvent);
              }}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                deleteEvent(selectedEvent.id);
              }}
              style={{ color: '#d93025', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>

        <p style={{ color: '#5f6368', fontSize: '13px' }}>{formattedStart}</p>

        {typeof selectedEvent.description === 'string' &&
          selectedEvent.description.trim() !== '' && (
            <div style={{ marginTop: '16px' }}>
              <strong>Description:</strong>
              <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                {selectedEvent.description}
              </p>
            </div>
          )}

        {typeof selectedEvent.location?.name === 'string' &&
          selectedEvent.location.name.trim() !== '' && (
            <div style={{ marginTop: '12px' }}>
              <strong>Location:</strong> {selectedEvent.location.name}
            </div>
          )}

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={closeEventDetails}
            style={{ padding: '6px 16px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
