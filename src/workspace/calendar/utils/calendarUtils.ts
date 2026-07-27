import { CalendarEvent } from '../types/event';

export interface PositionedEvent {
  event: CalendarEvent;
  topPercent: number; // Offset from top of grid (0 to 100)
  heightPercent: number; // Height relative to total day grid (0 to 100)
  leftPercent: number; // Horizontal offset percentage for overlapping events
  widthPercent: number; // Horizontal width percentage
}

export const calculateEventPositions = (
  events: CalendarEvent[],
  dayStartHour = 0,
  dayEndHour = 24,
): PositionedEvent[] => {
  const totalMinutesInDay = (dayEndHour - dayStartHour) * 60;

  // Filter out all-day events (handled separately)
  const timedEvents = events
    .filter((e) => !e.isAllDay)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const positionedEvents: PositionedEvent[] = [];

  timedEvents.forEach((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    const startMinutes = start.getHours() * 60 + start.getMinutes() - dayStartHour * 60;
    const durationMinutes = Math.max((end.getTime() - start.getTime()) / (1000 * 60), 15); // min 15 mins height

    const topPercent = Math.max(0, (startMinutes / totalMinutesInDay) * 100);
    const heightPercent = Math.min((durationMinutes / totalMinutesInDay) * 100, 100 - topPercent);

    positionedEvents.push({
      event,
      topPercent,
      heightPercent,
      leftPercent: 0,
      widthPercent: 100,
    });
  });

  // Calculate overlapping clusters
  for (let i = 0; i < positionedEvents.length; i++) {
    let overlapCount = 1;
    let columnIndex = 0;

    const curr = positionedEvents[i];

    for (let j = 0; j < i; j++) {
      const prev = positionedEvents[j];

      const prevEnd = new Date(prev.event.end).getTime();
      const currStart = new Date(curr.event.start).getTime();

      if (prevEnd > currStart) {
        overlapCount++;
        columnIndex++;
      }
    }

    if (overlapCount > 1) {
      const width = 100 / overlapCount;
      curr.widthPercent = width;
      curr.leftPercent = (columnIndex % overlapCount) * width;
    }
  }

  return positionedEvents;
};
