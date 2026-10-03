import { describe, it, expect } from 'vitest';
import { getGreeting, getTimeSlot, selectVariationIndex } from '../home/getGreeting';

describe('getGreeting system', () => {
  const baseStats = {
    totalEvents: 0,
    eventsToday: 0,
    upcomingEvents: 0,
    pendingTasks: 0,
    completedTasks: 0,
    recentFiles: 0,
    starredFavorites: 0,
    aiConversations: 0,
    activeProjects: 0,
    focusMinutesToday: 0,
    productivityEfficiency: 0,
  };

  describe('Local Time Slots (5 slots)', () => {
    it('shows Good morning at 06:00 (05:00-11:59)', () => {
      const now = new Date('2026-10-02T06:00:00');
      const sameDayVisit = new Date('2026-10-02T05:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDayVisit,
        stats: baseStats,
        isQuote: false,
      });

      expect(getTimeSlot(now)).toBe('morning');
      expect(result.timeSlot).toBe('morning');
      expect(result.timeGreeting).toBe('Good morning');
      expect(result.greeting).toBe('Good morning, Vamsi');
      expect(result.emoji).toBe('☀️');
    });

    it('shows Good afternoon at 13:00 (12:00-16:59)', () => {
      const now = new Date('2026-10-02T13:00:00');
      const sameDayVisit = new Date('2026-10-02T11:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDayVisit,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.timeSlot).toBe('afternoon');
      expect(result.timeGreeting).toBe('Good afternoon');
      expect(result.greeting).toBe('Good afternoon, Vamsi');
      expect(result.emoji).toBe('🌤️');
    });

    it('shows Good evening at 18:00 (17:00-20:59)', () => {
      const now = new Date('2026-10-02T18:00:00');
      const sameDayVisit = new Date('2026-10-02T12:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDayVisit,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.timeSlot).toBe('evening');
      expect(result.timeGreeting).toBe('Good evening');
      expect(result.greeting).toBe('Good evening, Vamsi');
      expect(result.emoji).toBe('🌆');
    });

    it('shows Good night at 22:00 (21:00-23:59)', () => {
      const now = new Date('2026-10-02T22:00:00');
      const sameDayVisit = new Date('2026-10-02T20:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDayVisit,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.timeSlot).toBe('night');
      expect(result.timeGreeting).toBe('Good night');
      expect(result.greeting).toBe('Good night, Vamsi');
      expect(result.emoji).toBe('🌙');
    });

    it('shows Burning the midnight oil at 02:00 (00:00-04:59)', () => {
      const now = new Date('2026-10-02T02:00:00');
      const sameDayVisit = new Date('2026-10-02T01:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDayVisit,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.timeSlot).toBe('midnight');
      expect(result.timeGreeting).toBe('Burning the midnight oil');
      expect(result.greeting).toBe('Burning the midnight oil, Vamsi');
      expect(result.emoji).toBe('🦉');
    });
  });

  describe('Visit Recency Overrides & Priorities', () => {
    it('handles first visit ever correctly', () => {
      const now = new Date('2026-10-02T10:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: null,
        stats: { ...baseStats, pendingTasks: 5 }, // even with pending tasks, first visit onboarding wins
        isQuote: false,
        headlineIndex: 0,
        messageIndex: 0,
      });

      expect(result.isVisitOverride).toBe(true);
      expect(result.emoji).toBe('✨');
      expect(result.greeting).toBe('Welcome, Vamsi');
      // Subtitle receives time greeting prefix when visit override wins
      expect(result.message).toContain('Good morning!');
      expect(result.message).toContain("Let's set up your workspace");
    });

    it('handles 2 days away (1-6 days ago)', () => {
      const now = new Date('2026-10-02T18:00:00');
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: twoDaysAgo,
        stats: baseStats,
        headlineIndex: 0,
        isQuote: false,
      });

      expect(result.isVisitOverride).toBe(true);
      expect(result.emoji).toBe('👋');
      expect(result.greeting).toBe('Welcome back, Vamsi');
      expect(result.message).toMatch(/^Good evening!/);
    });

    it('handles 10 days away (7+ days ago)', () => {
      const now = new Date('2026-10-02T18:00:00');
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: tenDaysAgo,
        stats: baseStats,
        headlineIndex: 0,
        isQuote: false,
      });

      expect(result.isVisitOverride).toBe(true);
      expect(result.emoji).toBe('💜');
      expect(result.greeting).toBe('Long time no see, Vamsi');
      expect(result.message).toMatch(/^Good evening!/);
    });

    it('handles same day (less than 24h away) by falling back to time-based greeting', () => {
      const now = new Date('2026-10-02T18:00:00');
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: threeHoursAgo,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.isVisitOverride).toBe(false);
      expect(result.greeting).toBe('Good evening, Vamsi');
      expect(result.emoji).toBe('🌆');
      // Subtitle does not duplicate "Good evening!" prefix
      expect(result.message).not.toMatch(/^Good evening!/);
    });

    it('handles future lastVisit (clock skew) safely as same-day', () => {
      const now = new Date('2026-10-02T14:00:00');
      const futureDate = new Date(now.getTime() + 100000);
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: futureDate,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.isVisitOverride).toBe(false);
      expect(result.greeting).toBe('Good afternoon, Vamsi');
    });
  });

  describe('Subtitle Priority and Data-Aware Messaging', () => {
    const sameDay = new Date('2026-10-02T08:00:00');

    it('Priority 2: mentions pending tasks during morning or afternoon', () => {
      const morningNow = new Date('2026-10-02T09:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: morningNow,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 3, eventsToday: 2 },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe("You have 3 pending tasks. Let's make it count.");
    });

    it('Priority 3: mentions events today when no morning pending tasks or in other slots', () => {
      const eveningNow = new Date('2026-10-02T18:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: eveningNow,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 2, eventsToday: 1, completedTasks: 0 },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe('1 event on your schedule today.');
    });

    it('Priority 4: celebrates completed tasks in the evening', () => {
      const eveningNow = new Date('2026-10-02T19:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: eveningNow,
        lastVisit: sameDay,
        stats: { ...baseStats, completedTasks: 4, eventsToday: 0, pendingTasks: 0 },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe('4 tasks done today. Great work.');
    });

    it('Priority 5: mentions active projects if no higher priority matched', () => {
      const nightNow = new Date('2026-10-02T22:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: nightNow,
        lastVisit: sameDay,
        stats: { ...baseStats, activeProjects: 2 },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toContain('2 active projects underway');
    });

    it('Priority 6: mentions AI conversations if available', () => {
      const nightNow = new Date('2026-10-02T22:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: nightNow,
        lastVisit: sameDay,
        stats: { ...baseStats, aiConversations: 3 },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe('Pick up your last AI chat where you left off.');
    });

    it('Priority 7: everything empty shows encouraging clear day message', () => {
      const afternoonNow = new Date('2026-10-02T14:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: afternoonNow,
        lastVisit: sameDay,
        stats: {
          pendingTasks: 0,
          eventsToday: 0,
          completedTasks: 0,
          activeProjects: 0,
          aiConversations: 0,
        },
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe('Your day is clear. Start a project or ask AI anything.');
    });

    it('Priority 8: fallback time-based message when stats are not available or loading', () => {
      const morningNow = new Date('2026-10-02T08:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now: morningNow,
        lastVisit: sameDay,
        stats: null,
        messageIndex: 0,
        isQuote: false,
      });

      expect(result.message).toBe('Wishing you a productive and energizing morning.');
    });
  });

  describe('Singular and Plural Handling', () => {
    const morning = new Date('2026-10-02T09:00:00');
    const sameDay = new Date('2026-10-02T07:00:00');

    it('handles 1 task vs multiple tasks properly', () => {
      const singular = getGreeting({
        name: 'Vamsi',
        now: morning,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 1 },
        messageIndex: 0,
        isQuote: false,
      });
      expect(singular.message).toBe("You have 1 pending task. Let's make it count.");

      const plural = getGreeting({
        name: 'Vamsi',
        now: morning,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 2 },
        messageIndex: 0,
        isQuote: false,
      });
      expect(plural.message).toBe("You have 2 pending tasks. Let's make it count.");
    });

    it('never shows "0 tasks" and skips message', () => {
      const result = getGreeting({
        name: 'Vamsi',
        now: morning,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 0, eventsToday: 1 },
        messageIndex: 0,
        isQuote: false,
      });
      expect(result.message).not.toContain('0 tasks');
      expect(result.message).toBe('1 event on your schedule today.');
    });
  });

  describe('Anti-Repetition Variation', () => {
    it('does not select the same message index twice in a row', () => {
      const length = 4;
      const lastIndex = 2;
      for (let i = 0; i < 20; i++) {
        const nextIndex = selectVariationIndex(length, lastIndex);
        expect(nextIndex).not.toBe(lastIndex);
        expect(nextIndex).toBeGreaterThanOrEqual(0);
        expect(nextIndex).toBeLessThan(length);
      }
    });
  });

  describe('Name Handling and Edge Cases', () => {
    it('uses "there" naturally when name is empty or missing in base greeting', () => {
      const now = new Date('2026-10-02T18:00:00');
      const sameDay = new Date('2026-10-02T12:00:00');
      const result = getGreeting({
        name: '',
        now,
        lastVisit: sameDay,
        stats: baseStats,
        isQuote: false,
      });

      expect(result.greeting).toBe('Good evening, there');
    });

    it('cleanly drops name in visit override if name is missing or "there"', () => {
      const now = new Date('2026-10-02T18:00:00');
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const result = getGreeting({
        name: 'there',
        now,
        lastVisit: twoDaysAgo,
        stats: baseStats,
        headlineIndex: 0,
        isQuote: false,
      });

      expect(result.greeting).toBe('Welcome back');
      expect(result.displayName).toBe('');
    });

    it('shows motivational quote when isQuote is true', () => {
      const now = new Date('2026-10-02T14:00:00');
      const sameDay = new Date('2026-10-02T11:00:00');
      const result = getGreeting({
        name: 'Vamsi',
        now,
        lastVisit: sameDay,
        stats: { ...baseStats, pendingTasks: 5 },
        isQuote: true,
        messageIndex: 1,
      });

      expect(result.message).toBe('Focus on progress, not perfection.');
    });
  });
});
