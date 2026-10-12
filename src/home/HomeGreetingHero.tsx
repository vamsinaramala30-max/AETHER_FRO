import React, { useState, useEffect, useRef } from 'react';
import { getGreeting, GreetingStats, GreetingResult } from './getGreeting';

interface HomeGreetingHeroProps {
  displayName: string;
  stats?: GreetingStats | null;
  loading?: boolean;
}

const STORAGE_LAST_VISIT_KEY = 'aether_last_visit';
const STORAGE_LAST_MESSAGE_INDEX_KEY = 'aether_last_message_index';

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export const HomeGreetingHero: React.FC<HomeGreetingHeroProps> = ({
  displayName,
  stats,
  loading = false,
}) => {
  // Deterministic neutral greeting for SSR / initial hydration safety
  const safeInitialName = displayName?.trim() || 'there';
  const isAnonymous = !safeInitialName || safeInitialName.toLowerCase() === 'there';

  const [greetingData, setGreetingData] = useState<GreetingResult>({
    greeting: `Welcome, ${safeInitialName}`,
    message: 'Real-time workspace telemetry and performance counters.',
    emoji: '',
    timeSlot: 'evening',
    timeGreeting: 'Good evening',
    headlinePrefix: 'Welcome,',
    displayName: isAnonymous ? '' : safeInitialName,
    isVisitOverride: false,
    messageIndex: 0,
  });

  const [dateLabel, setDateLabel] = useState<string>('');
  const [isClientReady, setIsClientReady] = useState<boolean>(false);

  // Session ref locks random decisions for this page load (prevents re-randomizing when stats arrive)
  const sessionConfigRef = useRef<{
    now: Date;
    lastVisit: string | null;
    lastMessageIndex: number | null;
    isQuote: boolean;
    headlineIndex: number;
    hasUpdatedLastVisit: boolean;
  } | null>(null);

  useEffect(() => {
    // 1. Safe localStorage reads wrapped in try/catch (private browsing safe)
    let storedLastVisit: string | null = null;
    let storedLastMsgIndex: number | null = null;

    try {
      storedLastVisit = localStorage.getItem(STORAGE_LAST_VISIT_KEY);
      const rawIndex = localStorage.getItem(STORAGE_LAST_MESSAGE_INDEX_KEY);
      if (rawIndex !== null) {
        const parsed = parseInt(rawIndex, 10);
        if (!isNaN(parsed)) {
          storedLastMsgIndex = parsed;
        }
      }
    } catch (e) {
      // localStorage may be blocked in strict private browsing
      console.warn('[HomeGreetingHero] LocalStorage read blocked:', e);
    }

    // Initialize session configuration once per page load
    if (!sessionConfigRef.current) {
      sessionConfigRef.current = {
        now: new Date(),
        lastVisit: storedLastVisit,
        lastMessageIndex: storedLastMsgIndex,
        isQuote: Math.random() < 0.2, // ~1 in 5 loads shows quote
        headlineIndex: Math.floor(Math.random() * 2),
        hasUpdatedLastVisit: false,
      };
    }

    setDateLabel(formatDate());
    setIsClientReady(true);
  }, []);

  // Compute or update greeting when mounted or when stats update
  useEffect(() => {
    if (!sessionConfigRef.current) return;

    const { now, lastVisit, lastMessageIndex, isQuote, headlineIndex, hasUpdatedLastVisit } =
      sessionConfigRef.current;

    // If stats are still loading, pass null to gracefully trigger fallback message
    const currentStats = loading ? null : stats;

    const result = getGreeting({
      name: displayName,
      stats: currentStats,
      lastVisit,
      now,
      lastMessageIndex,
      isQuote,
      headlineIndex,
    });

    setGreetingData(result);

    // Update lastVisit in localStorage ONLY ONCE per page load, after greeting is computed
    if (!hasUpdatedLastVisit) {
      sessionConfigRef.current.hasUpdatedLastVisit = true;
      try {
        localStorage.setItem(STORAGE_LAST_VISIT_KEY, now.toISOString());
        localStorage.setItem(STORAGE_LAST_MESSAGE_INDEX_KEY, String(result.messageIndex));
      } catch (e) {
        console.warn('[HomeGreetingHero] LocalStorage write blocked:', e);
      }
    }
  }, [displayName, stats, loading, isClientReady]);

  return (
    <div
      className="flex min-h-[84px] flex-col justify-center space-y-1 transition-opacity duration-300 motion-reduce:transition-none sm:min-h-[92px]"
      data-testid="home-greeting-hero"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-aether-muted">
        {dateLabel || formatDate()}
      </p>

      <h1 className="flex flex-wrap items-baseline gap-x-1.5 text-2xl font-extrabold leading-snug tracking-tight text-aether-main sm:text-3xl">
        <span className="shrink-0">{greetingData.headlinePrefix}</span>
        {greetingData.displayName ? (
          <span
            className="inline-block max-w-[240px] truncate bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text align-baseline text-transparent sm:max-w-md"
            title={greetingData.displayName}
          >
            {greetingData.displayName}.
          </span>
        ) : (
          <span className="shrink-0">.</span>
        )}
        {greetingData.emoji && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block transform select-none align-middle text-xl transition-transform duration-200 hover:scale-110 sm:text-2xl"
          >
            {greetingData.emoji}
          </span>
        )}
      </h1>

      <p className="text-sm leading-relaxed text-aether-muted transition-opacity duration-300 motion-reduce:transition-none">
        {greetingData.message}
      </p>
    </div>
  );
};

export default HomeGreetingHero;
