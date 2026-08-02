import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { useEventStore } from '../store/eventStore';

export const AgendaView: React.FC = () => {
  const { events } = useEvents();
  const { openEventDetails } = useEventStore();

  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div style={{ padding: '16px', overflowY: 'auto' }}>
      <h3 style={{ color: 'var(--cal-text-primary)', marginTop: 0 }}>Agenda</h3>
      {sorted.map((e) => (
        <div
          key={e.id}
          onClick={() => {
            openEventDetails(e);
          }}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px',
            borderBottom: '1px solid var(--cal-border-color)',
            cursor: 'pointer',
          }}
        >
          <div style={{ width: '120px', fontSize: '13px', color: 'var(--cal-text-secondary)' }}>
            {new Date(e.start).toLocaleDateString()}
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: 'var(--cal-text-primary)' }}>
              {e.title}
            </strong>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--cal-text-secondary)' }}>
              {e.location?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
