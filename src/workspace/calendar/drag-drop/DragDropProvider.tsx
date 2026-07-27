import React, { useState } from 'react';
import { CalendarEvent } from '../types/event';
import { DragDropContext } from './DragDropContext';

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDragEvent, setActiveDragEvent] = useState<CalendarEvent | null>(null);

  return (
    <DragDropContext.Provider
      value={{
        activeDragEvent,
        startDragging: (event) => {
          setActiveDragEvent(event);
        },
        stopDragging: () => {
          setActiveDragEvent(null);
        },
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};
