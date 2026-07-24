import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/event';

export const useDragDrop = (onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

  const handleDragStart = useCallback((event: CalendarEvent) => {
    setDraggedEvent(event);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedEvent(null);
  }, []);

  const handleDropOnSlot = useCallback((targetStartIso: string, targetEndIso: string) => {
    if (!draggedEvent) return;

    onEventUpdate(draggedEvent.id, {
      start: targetStartIso,
      end: targetEndIso,
    });

    setDraggedEvent(null);
  }, [draggedEvent, onEventUpdate]);

  return {
    draggedEvent,
    handleDragStart,
    handleDragEnd,
    handleDropOnSlot,
  };
};