import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { useEventStore } from '../store/eventStore';

export const AgendaView: React.FC = () => {
  const { events } = useEvents();
  const { openEventDetails } = useEventStore();

  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div style={{ padding: '16px', overflowY: 'auto' }}>
      <h3>Agenda</h3>
      {sorted.map((e) => (
        <div
          key={e.id}
          onClick={() => openEventDetails(e)}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px',
            borderBottom: '1px solid #dadce0',
            cursor: 'pointer',
          }}
        >
          <div style={{ width: '120px', fontSize: '13px', color: '#5f6368' }}>
            {new Date(e.start).toLocaleDateString()}
          </div>
          <div>
            <strong style={{ fontSize: '14px' }}>{e.title}</strong>
            <p style={{ margin: 0, fontSize: '12px', color: '#5f6368' }}>{e.location?.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};