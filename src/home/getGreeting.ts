import { TIME_SLOT_CONFIG, VISIT_HEADLINES, SUBTITLE_MESSAGES, TimeSlot } from './greetingMessages';

export interface GreetingStats {
  totalEvents?: number;
  eventsToday?: number;
  upcomingEvents?: number;
  pendingTasks?: number;
  completedTasks?: number;
  recentFiles?: number;
  starredFavorites?: number;
  aiConversations?: number;
  activeProjects?: number;
  focusMinutesToday?: number;
  productivityEfficiency?: number;
}

export interface GetGreetingOptions {
  name?: string;
  stats?: GreetingStats | null;
  lastVisit?: Date | string | number | null;
  now?: Date;
  lastMessageIndex?: number | null;
  isQuote?: boolean;
  messageIndex?: number;
  headlineIndex?: number;
}

export interface GreetingResult {
  greeting: string;
  message: string;
  emoji: string;
  timeSlot: TimeSlot;
  timeGreeting: string;
  headlinePrefix: string;
  displayName: string;
  isVisitOverride: boolean;
  messageIndex: number;
}

/**
 * Determines local time slot based on hour of day:
 * 05:00-11:59 -> morning
 * 12:00-16:59 -> afternoon
 * 17:00-20:59 -> evening
 * 21:00-23:59 -> night
 * 00:00-04:59 -> midnight
 */
export function getTimeSlot(now: Date): TimeSlot {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 24) return 'night';
  return 'midnight';
}

/**
 * Picks an index without repeating the previous index if possible.
 */
export function selectVariationIndex(
  count: number,
  lastIndex?: number | null,
  overrideIndex?: number,
): number {
  if (typeof overrideIndex === 'number' && overrideIndex >= 0 && overrideIndex < count) {
    return overrideIndex;
  }
  if (count <= 1) return 0;
  if (typeof lastIndex === 'number' && lastIndex >= 0 && lastIndex < count) {
    const choices: number[] = [];
    for (let i = 0; i < count; i++) {
      if (i !== lastIndex) choices.push(i);
    }
    return choices[Math.floor(Math.random() * choices.length)];
  }
  return Math.floor(Math.random() * count);
}

/**
 * Pure function to calculate personalized greeting, message, and emoji.
 */
export function getGreeting(options: GetGreetingOptions = {}): GreetingResult {
  const {
    name,
    stats,
    lastVisit,
    now = new Date(),
    lastMessageIndex,
    isQuote,
    messageIndex: overrideMessageIndex,
    headlineIndex: overrideHeadlineIndex,
  } = options;

  const timeSlot = getTimeSlot(now);
  const timeConfig = TIME_SLOT_CONFIG[timeSlot];
  const timeGreeting = timeConfig.timeGreeting;

  // Determine visit recency
  let isFirstVisit = false;
  let isVisitOverride = false;
  let visitType: 'firstVisit' | 'returning1To6Days' | 'returning7PlusDays' | 'sameDay' = 'sameDay';

  if (lastVisit === undefined || lastVisit === null || lastVisit === '') {
    isFirstVisit = true;
    isVisitOverride = true;
    visitType = 'firstVisit';
  } else {
    const lastVisitDate = lastVisit instanceof Date ? lastVisit : new Date(lastVisit);
    if (isNaN(lastVisitDate.getTime())) {
      isFirstVisit = true;
      isVisitOverride = true;
      visitType = 'firstVisit';
    } else {
      const diffMs = now.getTime() - lastVisitDate.getTime();
      // Clock skew or future timestamp: treat as same day
      if (diffMs < 0) {
        visitType = 'sameDay';
      } else {
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays >= 7) {
          visitType = 'returning7PlusDays';
          isVisitOverride = true;
        } else if (diffDays >= 1) {
          visitType = 'returning1To6Days';
          isVisitOverride = true;
        } else {
          visitType = 'sameDay';
        }
      }
    }
  }

  // Name resolution
  const trimmedName = name?.trim() ?? '';
  const isAnonymous = !trimmedName || trimmedName.toLowerCase() === 'there';

  // Headline selection
  let headlinePrefix = '';
  let displayName = '';
  let greeting = '';
  let emoji = '';

  if (isVisitOverride && visitType !== 'sameDay') {
    const headlineConfig = VISIT_HEADLINES[visitType];
    emoji = headlineConfig.emoji;
    const hIndex = selectVariationIndex(headlineConfig.options.length, null, overrideHeadlineIndex);
    const chosenHeadline = headlineConfig.options[hIndex];

    if (isAnonymous) {
      headlinePrefix = chosenHeadline.format();
      displayName = '';
      greeting = headlinePrefix;
    } else {
      headlinePrefix = chosenHeadline.prefix;
      displayName = trimmedName;
      greeting = chosenHeadline.format(trimmedName);
    }
  } else {
    emoji = timeConfig.emoji;
    headlinePrefix = `${timeGreeting},`;
    displayName = isAnonymous ? 'there' : trimmedName;
    greeting = `${timeGreeting}, ${displayName}`;
  }

  // Subtitle selection
  // 1 in 5 loads shows quote (unless it's first visit)
  const showQuote = !isFirstVisit && (typeof isQuote === 'boolean' ? isQuote : Math.random() < 0.2);

  const pendingTasks = stats?.pendingTasks ?? 0;
  const eventsToday = stats?.eventsToday ?? 0;
  const completedTasks = stats?.completedTasks ?? 0;
  const activeProjects = stats?.activeProjects ?? 0;
  const aiConversations = stats?.aiConversations ?? 0;

  type MessageBankItem = string | ((n: number) => string);
  let chosenMessageBank: readonly MessageBankItem[] = [];
  let bankArg: number | undefined;

  if (isFirstVisit) {
    // Priority 1: First visit onboarding
    chosenMessageBank = SUBTITLE_MESSAGES.firstVisit;
  } else if (showQuote) {
    chosenMessageBank = SUBTITLE_MESSAGES.quotes;
  } else if (pendingTasks > 0 && (timeSlot === 'morning' || timeSlot === 'afternoon')) {
    // Priority 2: Pending tasks > 0 during morning or afternoon
    chosenMessageBank = SUBTITLE_MESSAGES.pendingTasks;
    bankArg = pendingTasks;
  } else if (eventsToday > 0) {
    // Priority 3: Events today > 0
    chosenMessageBank = SUBTITLE_MESSAGES.eventsToday;
    bankArg = eventsToday;
  } else if (completedTasks > 0 && timeSlot === 'evening') {
    // Priority 4: Tasks completed > 0 and evening
    chosenMessageBank = SUBTITLE_MESSAGES.tasksCompletedEvening;
    bankArg = completedTasks;
  } else if (activeProjects > 0) {
    // Priority 5: Active projects > 0
    chosenMessageBank = SUBTITLE_MESSAGES.activeProjects;
    bankArg = activeProjects;
  } else if (aiConversations > 0) {
    // Priority 6: AI conversations > 0
    chosenMessageBank = SUBTITLE_MESSAGES.aiConversations;
  } else {
    const hasAnyStats = stats !== null && stats !== undefined;
    const isEverythingEmpty =
      hasAnyStats &&
      pendingTasks === 0 &&
      eventsToday === 0 &&
      completedTasks === 0 &&
      activeProjects === 0 &&
      aiConversations === 0;

    if (isEverythingEmpty) {
      // Priority 7: Everything empty
      chosenMessageBank = SUBTITLE_MESSAGES.everythingEmpty;
    } else {
      // Priority 8: Fallback time-based message
      chosenMessageBank = SUBTITLE_MESSAGES.timeFallback[timeSlot];
    }
  }

  const selectedMsgIndex = selectVariationIndex(
    chosenMessageBank.length,
    lastMessageIndex,
    overrideMessageIndex,
  );

  const rawItem = chosenMessageBank[selectedMsgIndex];
  const rawMessage = typeof rawItem === 'function' ? rawItem(bankArg ?? 0) : rawItem;

  // When visit override wins, put the time greeting into the subtitle
  const finalMessage = isVisitOverride ? `${timeGreeting}! ${rawMessage}` : rawMessage;

  return {
    greeting,
    message: finalMessage,
    emoji,
    timeSlot,
    timeGreeting,
    headlinePrefix,
    displayName,
    isVisitOverride,
    messageIndex: selectedMsgIndex,
  };
}
