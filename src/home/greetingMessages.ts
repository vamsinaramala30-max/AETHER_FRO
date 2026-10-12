/**
 * Greeting and dynamic subtitle message banks for AETHER dashboard.
 * Easily editable without altering core greeting selection logic.
 */

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight';

export interface TimeSlotConfig {
  timeGreeting: string;
  emoji: string;
}

export const TIME_SLOT_CONFIG: Record<TimeSlot, TimeSlotConfig> = {
  morning: {
    timeGreeting: 'Good morning',
    emoji: '☀️',
  },
  afternoon: {
    timeGreeting: 'Good afternoon',
    emoji: '🌤️',
  },
  evening: {
    timeGreeting: 'Good evening',
    emoji: '🌆',
  },
  night: {
    timeGreeting: 'Good night',
    emoji: '🌙',
  },
  midnight: {
    timeGreeting: 'Burning the midnight oil',
    emoji: '🦉',
  },
};

export interface HeadlineOption {
  prefix: string;
  hasName: boolean;
  format: (name?: string) => string;
}

export interface VisitHeadlineConfig {
  emoji: string;
  options: HeadlineOption[];
}

export const VISIT_HEADLINES: {
  firstVisit: VisitHeadlineConfig;
  returning1To6Days: VisitHeadlineConfig;
  returning7PlusDays: VisitHeadlineConfig;
} = {
  firstVisit: {
    emoji: '✨',
    options: [
      {
        prefix: 'Welcome,',
        hasName: true,
        format: (name) => (name && name.toLowerCase() !== 'there' ? `Welcome, ${name}` : 'Welcome'),
      },
      {
        prefix: 'Nice to meet you,',
        hasName: true,
        format: (name) =>
          name && name.toLowerCase() !== 'there' ? `Nice to meet you, ${name}` : 'Nice to meet you',
      },
    ],
  },
  returning1To6Days: {
    emoji: '👋',
    options: [
      {
        prefix: 'Welcome back,',
        hasName: true,
        format: (name) =>
          name && name.toLowerCase() !== 'there' ? `Welcome back, ${name}` : 'Welcome back',
      },
      {
        prefix: 'Good to see you again,',
        hasName: true,
        format: (name) =>
          name && name.toLowerCase() !== 'there'
            ? `Good to see you again, ${name}`
            : 'Good to see you again',
      },
    ],
  },
  returning7PlusDays: {
    emoji: '💜',
    options: [
      {
        prefix: 'Long time no see,',
        hasName: true,
        format: (name) =>
          name && name.toLowerCase() !== 'there' ? `Long time no see, ${name}` : 'Long time no see',
      },
      {
        prefix: 'We missed you,',
        hasName: true,
        format: (name) =>
          name && name.toLowerCase() !== 'there' ? `We missed you, ${name}` : 'We missed you',
      },
    ],
  },
};

export const SUBTITLE_MESSAGES = {
  firstVisit: [
    "Let's set up your workspace. Start with a project or a chat.",
    'Welcome to AETHER. Explore your projects, tasks, or start an AI conversation.',
    'Ready to build? Kick off your workspace with a fresh project or AI query.',
    'Take a look around your new digital sanctuary to get started.',
  ],

  pendingTasks: [
    (n: number) =>
      `You have ${pluralize(n, 'pending task', 'pending tasks')}. Let's make it count.`,
    (n: number) =>
      `${pluralize(n, 'pending task', 'pending tasks')} on your schedule today. You've got this.`,
    (n: number) =>
      `Ready to tackle your ${pluralize(n, 'pending task', 'pending tasks')}? Let's dive in.`,
    (n: number) =>
      `Focus mode: you have ${pluralize(n, 'pending task', 'pending tasks')} queued up.`,
  ],

  eventsToday: [
    (n: number) => `${pluralize(n, 'event', 'events')} on your schedule today.`,
    (n: number) =>
      `You have ${pluralize(n, 'event', 'events')} scheduled for today. Check your calendar for details.`,
    (n: number) => `Calendar check: ${pluralize(n, 'event', 'events')} lined up today.`,
    (n: number) => `Your itinerary has ${pluralize(n, 'event', 'events')} planned today.`,
  ],

  tasksCompletedEvening: [
    (n: number) => `${pluralize(n, 'task', 'tasks')} done today. Great work.`,
    (n: number) => `You've completed ${pluralize(n, 'task', 'tasks')} today. Excellent progress.`,
    (n: number) => `Solid momentum: ${pluralize(n, 'task', 'tasks')} checked off today.`,
    (n: number) => `${pluralize(n, 'task', 'tasks')} accomplished today. Take pride in your work.`,
  ],

  activeProjects: [
    (n: number) =>
      `You have ${pluralize(n, 'active project', 'active projects')} underway. Keep the momentum going.`,
    (n: number) =>
      `Ready to continue making progress on your ${pluralize(n, 'active project', 'active projects')}?`,
    (n: number) =>
      `Pick up where you left off across your ${pluralize(n, 'active project', 'active projects')}.`,
    (n: number) =>
      `Your ${pluralize(n, 'project', 'projects')} are poised for your next milestone.`,
  ],

  aiConversations: [
    'Pick up your last AI chat where you left off.',
    'Your AI assistant is ready to help you brainstorm and build.',
    'Resume your recent AI discussions or explore a new concept.',
    'Collaborate with your AI agent on your next breakthrough.',
  ],

  everythingEmpty: [
    'Your day is clear. Start a project or ask AI anything.',
    'Clean slate today. A perfect time to plan or explore new ideas.',
    'Everything is peaceful. Kickstart something great today.',
    'No active obligations right now. Explore what inspires you next.',
  ],

  quotes: [
    'Small daily improvements over time lead to stunning results.',
    'Focus on progress, not perfection.',
    'The secret of getting ahead is getting started.',
    'Deep work happens one focused block at a time.',
  ],

  timeFallback: {
    morning: [
      'Wishing you a productive and energizing morning.',
      'Fresh morning, fresh momentum. Make today count.',
      'Seize the morning and set the tone for a great day.',
      'Ready for a focused morning in your workspace.',
    ],
    afternoon: [
      'Keep the momentum going strong this afternoon.',
      'Power through your afternoon goals with clarity.',
      'Halfway through the day—stay sharp and inspired.',
      'Afternoon focus session ready when you are.',
    ],
    evening: [
      'Wrapping up for the day or finding your second wind?',
      'Reflect on today’s wins and unwind at your own pace.',
      'Peaceful evening vibes across your workspace.',
      'Evening is here—review what went well today.',
    ],
    night: [
      'Winding down for a quiet, restful night.',
      'Organize loose ends before calling it a day.',
      'Quiet night in your digital sanctuary.',
      'A calm night to reflect and recharge.',
    ],
    midnight: [
      'Late night breakthroughs often bring the best ideas.',
      'Deep focus in the quiet hours. Remember to get some rest.',
      'Midnight inspiration striking? Capture your thoughts.',
      'Burning the midnight oil—stay hydrated and take breaks.',
    ],
  },
};
