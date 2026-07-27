import { createContext, useContext } from 'react';
import { CalendarEvent } from '../types/event';

export interface DragDropContextType {
  activeDragEvent: CalendarEvent | null;
  startDragging: (event: CalendarEvent) => void;
  stopDragging: () => void;
}

export const DragDropContext = createContext<DragDropContextType>({
  activeDragEvent: null,
  startDragging: () => {},
  stopDragging: () => {},
});

export const useDragDropContext = () => useContext(DragDropContext);
