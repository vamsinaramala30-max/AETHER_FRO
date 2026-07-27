import React from 'react';
import { useDragDropContext } from './DragDropContext';

export const EventDragLayer: React.FC = () => {
  const { activeDragEvent } = useDragDropContext();

  if (!activeDragEvent) return null;

  const bgColor =
    typeof activeDragEvent.color === 'string' && activeDragEvent.color.trim() !== ''
      ? activeDragEvent.color
      : '#039be5';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        opacity: 0.8,
        backgroundColor: bgColor,
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {activeDragEvent.title}
    </div>
  );
};
