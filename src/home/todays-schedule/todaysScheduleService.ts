export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  category: 'meeting' | 'deep-work' | 'review' | 'break';
  attendeesCount?: number;
  meetingLink?: string;
  isCurrent?: boolean;
}

export async function fetchTodaysSchedule(): Promise<ScheduleEvent[]> {
  return [
    {
      id: 'evt-1',
      title: 'Architecture Sync with Mobile Team',
      startTime: '09:30 AM',
      endTime: '10:15 AM',
      location: 'Zoom Room 4',
      category: 'meeting',
      attendeesCount: 6,
      meetingLink: 'https://zoom.us/j/example123',
      isCurrent: false,
    },
    {
      id: 'evt-2',
      title: 'React 19 Core Upgrade & Benchmarking',
      startTime: '10:30 AM',
      endTime: '01:00 PM',
      location: 'Deep Work Slot',
      category: 'deep-work',
      isCurrent: true,
    },
    {
      id: 'evt-3',
      title: 'Sprint 24 PR Code Reviews',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      location: 'GitHub Async',
      category: 'review',
      attendeesCount: 3,
    },
  ];
}
