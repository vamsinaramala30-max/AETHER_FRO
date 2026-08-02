import React from 'react';
import { CalendarEvent } from '../types/event';
import { format12HourTime } from '../utils/dateUtils';

interface EventCardProps {
  event: CalendarEvent;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, style, onClick }) => {
  const startTimeStr = format12HourTime(new Date(event.start));
  const endTimeStr = format12HourTime(new Date(event.end));

  const getEventColors = (colorHex?: string, title?: string) => {
    // Match colors from screenshot precisely based on title/category
    const titleLower = title?.toLowerCase() || '';
    if (
      titleLower.includes('standup') ||
      titleLower.includes('design review') ||
      titleLower.includes('planning') ||
      titleLower.includes('marketing') ||
      titleLower.includes('dinner')
    ) {
      return {
        bg: 'rgba(29, 78, 216, 0.25)',
        border: '#3b82f6',
        text: '#93c5fd',
        timeText: '#60a5fa',
      };
    }
    if (
      titleLower.includes('client') ||
      titleLower.includes('wrap-up') ||
      titleLower.includes('research') ||
      titleLower.includes('product review') ||
      titleLower.includes('system review')
    ) {
      return {
        bg: 'rgba(126, 34, 206, 0.25)',
        border: '#a855f7',
        text: '#e9d5ff',
        timeText: '#c084fc',
      };
    }
    if (
      titleLower.includes('gym') ||
      titleLower.includes('lunch') ||
      titleLower.includes('roadmap')
    ) {
      return {
        bg: 'rgba(5, 150, 105, 0.25)',
        border: '#10b981',
        text: '#a7f3d0',
        timeText: '#34d399',
      };
    }
    if (titleLower.includes('learning')) {
      return {
        bg: 'rgba(194, 65, 12, 0.25)',
        border: '#f97316',
        text: '#fed7aa',
        timeText: '#fb923c',
      };
    }

    // Default fallback
    return {
      bg: 'rgba(99, 102, 241, 0.25)',
      border: colorHex || '#6366f1',
      text: '#e0e7ff',
      timeText: '#a5b4fc',
    };
  };

  const colors = getEventColors(event.color, event.title);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        borderRadius: '6px',
        padding: '6px 8px',
        fontSize: '12px',
        color: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(4px)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        ...style,
      }}
    >
      <div
        style={{
          fontWeight: '600',
          fontSize: '12px',
          color: '#f8fafc',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {event.title}
      </div>
      {!event.isAllDay && (
        <div
          style={{ fontSize: '11px', color: colors.timeText, marginTop: '2px', fontWeight: '500' }}
        >
          {startTimeStr} - {endTimeStr}
        </div>
      )}
    </div>
  );
};
