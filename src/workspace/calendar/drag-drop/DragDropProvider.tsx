import React, { createContext, useContext, useState } from 'react';
import { CalendarEvent } from '../types/event';

interface DragDropContextType {
  activeDragEvent: CalendarEvent | null;
  startDragging: (event: CalendarEvent) => void;
  stopDragging: () => void;
}

const DragDropContext = createContext<DragDropContextType>({
  activeDragEvent: null,
  startDragging: () => {},
  stopDragging: () => {},
});

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDragEvent, setActiveDragEvent] = useState<CalendarEvent | null>(null);

  return (
    <DragDropContext.Provider
      value={{
        activeDragEvent,
        startDragging: (event) => setActiveDragEvent(event),
        stopDragging: () => setActiveDragEvent(null),
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDropContext = () => useContext(DragDropContext);