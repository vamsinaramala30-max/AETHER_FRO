import React, { useCallback, useEffect, useRef, useState } from 'react';
import { productivityService } from '../productivity-hub/productivityservice';

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface FocusSessionItem {
  id: string;
  minutes: number;
  createdAt: number;
}

export type DailyHistory = Record<string, FocusSessionItem[]>;

const MIN_MINUTES = 1;
const MAX_MINUTES = 240;
const DEFAULT_MINUTES = 0;
const HISTORY_KEY = 'focus-timer-history';

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateLabel(key: string): string {
  const today = todayKey();
  if (key === today) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (key === yKey) return 'Yesterday';

  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface BellNote {
  frequency: number;
  startOffset: number;
  duration: number;
  gain: number;
}

// Some browsers (older Safari) only expose the prefixed constructor,
// which isn't in the standard DOM lib types.
interface WindowWithWebkitAudio {
  webkitAudioContext?: typeof AudioContext;
}

function playCompletionSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext ?? (window as unknown as WindowWithWebkitAudio).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();

    const notes: BellNote[] = [
      { frequency: 987.77, startOffset: 0, duration: 0.22, gain: 0.22 },
      { frequency: 987.77, startOffset: 0.3, duration: 0.22, gain: 0.22 },
      { frequency: 523.25, startOffset: 0.75, duration: 0.4, gain: 0.22 },
      { frequency: 659.25, startOffset: 1.1, duration: 0.4, gain: 0.22 },
      { frequency: 783.99, startOffset: 1.45, duration: 0.45, gain: 0.22 },
      { frequency: 1046.5, startOffset: 1.85, duration: 0.5, gain: 0.22 },
      { frequency: 1318.51, startOffset: 2.3, duration: 0.55, gain: 0.22 },
      { frequency: 1568.0, startOffset: 2.8, duration: 0.6, gain: 0.22 },
      { frequency: 1046.5, startOffset: 3.35, duration: 1.5, gain: 0.16 },
      { frequency: 1318.51, startOffset: 3.35, duration: 1.5, gain: 0.14 },
      { frequency: 1568.0, startOffset: 3.35, duration: 1.5, gain: 0.14 },
      { frequency: 2093.0, startOffset: 3.35, duration: 1.3, gain: 0.08 },
    ];

    notes.forEach(({ frequency, startOffset, duration, gain }) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      const overtone = audioContext.createOscillator();
      const overtoneGain = audioContext.createGain();
      overtone.type = 'sine';
      overtone.frequency.value = frequency * 2;

      const startTime = audioContext.currentTime + startOffset;
      const endTime = startTime + duration;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

      overtoneGain.gain.setValueAtTime(0, startTime);
      overtoneGain.gain.linearRampToValueAtTime(gain * 0.25, startTime + 0.03);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, endTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      overtone.connect(overtoneGain);
      overtoneGain.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(endTime + 0.05);
      overtone.start(startTime);
      overtone.stop(endTime + 0.05);
    });

    const totalDuration = Math.max(...notes.map((n) => n.startOffset + n.duration)) + 0.2;
    window.setTimeout(() => {
      void audioContext.close();
    }, totalDuration * 1000);
  } catch {
    // Web Audio API unavailable or blocked; fail silently.
  }
}

function notifyCompletion(): void {
  const title = '🎉 Focus session completed!';
  const body = 'Great work!';

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification(title, { body });
      return;
    } catch {
      // Fall through to alert if notification construction fails.
    }
  }
  window.alert(`${title}\n${body}`);
}

// --- Decorative background -------------------------------------------

interface OrbSpec {
  cls: string;
  size: number;
  top: string;
  left: string;
  color: 'blue' | 'amber' | 'emerald' | 'gray';
  blur: number;
}

interface ParticleSpec {
  top: string;
  left: string;
  size: number;
  color: 'blue' | 'amber' | 'emerald' | 'gray';
  dur: number;
  delay: number;
}

// Static so positions never reshuffle on re-render (the timer ticks
// every 250ms while running, which would otherwise cause visible jumps).
const ORB_DATA: OrbSpec[] = [
  { cls: 'orb-a', size: 340, top: '-10%', left: '-8%', color: 'blue', blur: 56 },
  { cls: 'orb-b', size: 270, top: '58%', left: '80%', color: 'amber', blur: 50 },
  { cls: 'orb-c', size: 310, top: '72%', left: '-12%', color: 'emerald', blur: 54 },
  { cls: 'orb-d', size: 230, top: '2%', left: '72%', color: 'gray', blur: 46 },
  { cls: 'orb-e', size: 190, top: '38%', left: '42%', color: 'blue', blur: 42 },
  { cls: 'orb-f', size: 150, top: '16%', left: '22%', color: 'emerald', blur: 38 },
];

const PARTICLE_DATA: ParticleSpec[] = [
  { top: '12%', left: '8%', size: 5, color: 'blue', dur: 7, delay: 0 },
  { top: '22%', left: '84%', size: 4, color: 'amber', dur: 9, delay: 1.2 },
  { top: '38%', left: '18%', size: 3, color: 'emerald', dur: 6.5, delay: 0.6 },
  { top: '48%', left: '68%', size: 6, color: 'blue', dur: 8.5, delay: 2 },
  { top: '62%', left: '30%', size: 4, color: 'gray', dur: 7.5, delay: 0.3 },
  { top: '70%', left: '88%', size: 3, color: 'emerald', dur: 10, delay: 1.7 },
  { top: '80%', left: '12%', size: 5, color: 'amber', dur: 6, delay: 2.4 },
  { top: '8%', left: '55%', size: 3, color: 'blue', dur: 9.5, delay: 1 },
  { top: '88%', left: '55%', size: 4, color: 'gray', dur: 8, delay: 0.8 },
  { top: '30%', left: '94%', size: 3, color: 'emerald', dur: 7, delay: 1.9 },
];

// Soft floating orbs + drifting particles, purely decorative. Sits
// behind everything, never intercepts pointer events, and reuses the
// app's existing blue / amber / emerald / gray palette at low opacity.
function FloatingBackground(): React.ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORB_DATA.map((orb) => (
        <div
          key={orb.cls}
          className={`orb orb-${orb.color} ${orb.cls}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            filter: `blur(${orb.blur}px)`,
          }}
        />
      ))}

      {PARTICLE_DATA.map((p, i) => (
        <span
          key={i}
          className={`particle particle-${p.color}`}
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        .orb {
          position: absolute;
          border-radius: 9999px;
          will-change: transform;
        }
        .orb-blue {
          background: radial-gradient(circle at 32% 28%, rgba(59,130,246,0.55), rgba(59,130,246,0) 70%);
        }
        .orb-amber {
          background: radial-gradient(circle at 32% 28%, rgba(245,158,11,0.45), rgba(245,158,11,0) 70%);
        }
        .orb-emerald {
          background: radial-gradient(circle at 32% 28%, rgba(16,185,129,0.45), rgba(16,185,129,0) 70%);
        }
        .orb-gray {
          background: radial-gradient(circle at 32% 28%, rgba(107,114,128,0.35), rgba(107,114,128,0) 70%);
        }
        .dark .orb-blue {
          background: radial-gradient(circle at 32% 28%, rgba(96,165,250,0.16), rgba(96,165,250,0) 70%);
        }
        .dark .orb-amber {
          background: radial-gradient(circle at 32% 28%, rgba(251,191,36,0.13), rgba(251,191,36,0) 70%);
        }
        .dark .orb-emerald {
          background: radial-gradient(circle at 32% 28%, rgba(52,211,153,0.13), rgba(52,211,153,0) 70%);
        }
        .dark .orb-gray {
          background: radial-gradient(circle at 32% 28%, rgba(156,163,175,0.12), rgba(156,163,175,0) 70%);
        }

        @keyframes floatA {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(42px, 32px) scale(1.09); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(-38px, 26px) scale(0.93); }
        }
        @keyframes floatC {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(32px, -36px) scale(1.07); }
        }
        @keyframes floatD {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(-26px, -22px) scale(1.1); }
        }
        @keyframes floatE {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(22px, 22px) scale(0.95); }
        }
        @keyframes floatF {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(-18px, 24px) scale(1.12); }
        }
        .orb-a { animation: floatA 27s ease-in-out infinite; }
        .orb-b { animation: floatB 33s ease-in-out infinite; }
        .orb-c { animation: floatC 30s ease-in-out infinite; }
        .orb-d { animation: floatD 25s ease-in-out infinite; }
        .orb-e { animation: floatE 35s ease-in-out infinite; }
        .orb-f { animation: floatF 22s ease-in-out infinite; }

        .particle {
          position: absolute;
          border-radius: 9999px;
          opacity: 0;
          animation-name: drift, twinkle;
          animation-timing-function: ease-in-out, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }
        .particle-blue { background: rgba(59,130,246,0.65); box-shadow: 0 0 6px rgba(59,130,246,0.5); }
        .particle-amber { background: rgba(245,158,11,0.6); box-shadow: 0 0 6px rgba(245,158,11,0.45); }
        .particle-emerald { background: rgba(16,185,129,0.6); box-shadow: 0 0 6px rgba(16,185,129,0.45); }
        .particle-gray { background: rgba(107,114,128,0.5); box-shadow: 0 0 5px rgba(107,114,128,0.35); }
        .dark .particle-blue { background: rgba(96,165,250,0.35); box-shadow: 0 0 6px rgba(96,165,250,0.25); }
        .dark .particle-amber { background: rgba(251,191,36,0.3); box-shadow: 0 0 6px rgba(251,191,36,0.2); }
        .dark .particle-emerald { background: rgba(52,211,153,0.3); box-shadow: 0 0 6px rgba(52,211,153,0.2); }
        .dark .particle-gray { background: rgba(156,163,175,0.28); box-shadow: 0 0 5px rgba(156,163,175,0.18); }

        @keyframes drift {
          0%   { transform: translate(0px, 0px); }
          50%  { transform: translate(14px, -18px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          15%      { opacity: 0.9; }
          50%      { opacity: 0.35; }
          85%      { opacity: 0.9; }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb, .particle { animation: none !important; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// --- History persistence (localStorage) --------------------------------
// Note: this runs in a real app, not the Claude.ai artifact sandbox, so
// it uses localStorage rather than the artifact-only `window.storage`.

function loadHistory(): DailyHistory {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return {};

    const normalized: DailyHistory = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === 'number') {
        normalized[key] = [
          {
            id: `legacy-${key}`,
            minutes: val,
            createdAt: new Date(key).getTime() || Date.now(),
          },
        ];
      } else if (Array.isArray(val)) {
        normalized[key] = val
          .map((item, idx) => {
            if (typeof item === 'number') {
              return {
                id: `${key}-${idx}`,
                minutes: item,
                createdAt: Date.now() - idx * 1000,
              };
            } else if (
              item &&
              typeof item === 'object' &&
              typeof (item as any).minutes === 'number'
            ) {
              return {
                id: (item as any).id || `${key}-${idx}`,
                minutes: (item as any).minutes,
                createdAt: (item as any).createdAt || Date.now(),
              };
            }
            return { id: `${key}-${idx}`, minutes: 0, createdAt: Date.now() };
          })
          .filter((s) => s.minutes > 0)
          .sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    return normalized;
  } catch {
    return {};
  }
}

function saveHistory(history: DailyHistory): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

// --- Main component ------------------------------------------------------

interface FocusTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export default function FocusTimer({ onSessionComplete }: FocusTimerProps): React.ReactElement {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(DEFAULT_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_MINUTES * 60);
  const [status, setStatus] = useState<TimerStatus>('idle');

  const [history, setHistory] = useState<DailyHistory>({});
  const [historyLoaded, setHistoryLoaded] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const endTimestampRef = useRef<number | null>(null);
  const remainingAtPauseRef = useRef<number>(DEFAULT_MINUTES * 60);
  // Typed as number (browser setInterval return type) rather than
  // NodeJS.Timeout, in case @types/node is also present in the project.
  const intervalRef = useRef<number | null>(null);

  const notifyUpdate = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aether-focus-updated'));
    }
  }, []);

  // Load saved history once on mount.
  useEffect(() => {
    setHistory(loadHistory());
    setHistoryLoaded(true);
  }, []);

  const persistHistory = useCallback((nextHistory: DailyHistory) => {
    const ok = saveHistory(nextHistory);
    setHistoryError(ok ? null : "Couldn't save history.");
  }, []);

  const recordSession = useCallback(
    (minutes: number) => {
      void productivityService.logFocusSession(minutes);
      setHistory((prev) => {
        const key = todayKey();
        const newSession: FocusSessionItem = {
          id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          minutes,
          createdAt: Date.now(),
        };
        const existing = prev[key] || [];
        const next: DailyHistory = { ...prev, [key]: [newSession, ...existing] };
        persistHistory(next);
        return next;
      });
      notifyUpdate();
    },
    [persistHistory, notifyUpdate],
  );

  const deleteSession = useCallback(
    (dateKey: string, sessionId: string) => {
      setHistory((prev) => {
        const currentList = prev[dateKey] || [];
        const updatedList = currentList.filter((s) => s.id !== sessionId);
        const next = { ...prev };
        if (updatedList.length > 0) {
          next[dateKey] = updatedList;
        } else {
          delete next[dateKey];
        }
        persistHistory(next);
        return next;
      });
      notifyUpdate();
    },
    [persistHistory, notifyUpdate],
  );

  const deleteDay = useCallback(
    (key: string) => {
      setHistory((prev) => {
        const next: DailyHistory = { ...prev };
        delete next[key];
        persistHistory(next);
        return next;
      });
      notifyUpdate();
    },
    [persistHistory, notifyUpdate],
  );

  const clearAllHistory = useCallback(() => {
    setHistory({});
    persistHistory({});
    notifyUpdate();
  }, [persistHistory, notifyUpdate]);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishTimer = useCallback(() => {
    clearTick();
    endTimestampRef.current = null;
    setStatus('finished');
    setRemainingSeconds(0);

    playCompletionSound();
    notifyCompletion();
    recordSession(selectedMinutes);
    onSessionComplete?.(selectedMinutes);

    setStatus('idle');
    setRemainingSeconds(selectedMinutes * 60);
    remainingAtPauseRef.current = selectedMinutes * 60;
  }, [clearTick, selectedMinutes, onSessionComplete, recordSession]);

  const tick = useCallback(() => {
    if (endTimestampRef.current === null) return;
    const msRemaining = endTimestampRef.current - Date.now();
    const secondsRemaining = Math.ceil(msRemaining / 1000);

    if (secondsRemaining <= 0) {
      finishTimer();
      return;
    }
    setRemainingSeconds(secondsRemaining);
  }, [finishTimer]);

  useEffect(() => {
    if (status !== 'running') return;
    intervalRef.current = window.setInterval(tick, 250) as unknown as number;
    return () => {
      clearTick();
    };
  }, [status, tick, clearTick]);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      setRemainingSeconds(selectedMinutes * 60);
      remainingAtPauseRef.current = selectedMinutes * 60;
    }
  }, [selectedMinutes, status]);

  useEffect(() => {
    return () => {
      clearTick();
    };
  }, [clearTick]);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, value));
    setSelectedMinutes(clamped);
  };

  const handleStart = () => {
    if (status === 'running') return;
    const startSeconds = status === 'paused' ? remainingAtPauseRef.current : selectedMinutes * 60;
    endTimestampRef.current = Date.now() + startSeconds * 1000;
    setRemainingSeconds(startSeconds);
    setStatus('running');
  };

  const handlePause = () => {
    if (status !== 'running') return;
    clearTick();
    if (endTimestampRef.current !== null) {
      const msRemaining = endTimestampRef.current - Date.now();
      remainingAtPauseRef.current = Math.max(0, Math.ceil(msRemaining / 1000));
      setRemainingSeconds(remainingAtPauseRef.current);
    }
    endTimestampRef.current = null;
    setStatus('paused');
  };

  const handleResume = () => {
    if (status !== 'paused') return;
    endTimestampRef.current = Date.now() + remainingAtPauseRef.current * 1000;
    setStatus('running');
  };

  const handleStop = () => {
    clearTick();
    endTimestampRef.current = null;
    setStatus('idle');
    setRemainingSeconds(selectedMinutes * 60);
    remainingAtPauseRef.current = selectedMinutes * 60;
  };

  const handleReset = () => {
    clearTick();
    endTimestampRef.current = null;
    setStatus('idle');
    setRemainingSeconds(selectedMinutes * 60);
    remainingAtPauseRef.current = selectedMinutes * 60;
  };

  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

  const todaySessions = history[todayKey()] || [];
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.minutes, 0);
  const sortedDays = Object.keys(history).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 px-4 py-10 dark:bg-gray-900">
      <FloatingBackground />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transition-colors dark:bg-gray-800 sm:p-8">
        <h1 className="mb-1 text-center text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl">
          Focus Timer
        </h1>
        <p className="mb-6 text-center text-xs font-medium text-blue-600 dark:text-blue-400">
          {todayTotal > 0 ? `${todayTotal} min focused today` : 'No focus time logged yet today'}
        </p>

        <div className="mb-8 flex justify-center">
          <span
            className="select-none font-mono text-6xl font-bold tabular-nums text-gray-900 dark:text-gray-50 sm:text-7xl"
            aria-live="polite"
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>

        <div className="mb-6 flex flex-col items-center gap-2">
          <label
            htmlFor="focus-duration"
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Focus Time (minutes)
          </label>
          <input
            id="focus-duration"
            type="number"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={selectedMinutes}
            onChange={handleDurationChange}
            disabled={!isIdle}
            className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-base text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleStart}
            disabled={isRunning}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Start
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={!isRunning}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleResume}
            disabled={!isPaused}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={isIdle}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="col-span-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 sm:col-span-1"
          >
            Reset
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {isRunning && 'Focus session in progress…'}
          {isPaused && 'Paused — resume when ready.'}
          {isIdle && 'Set your focus time and press Start.'}
        </p>

        <div className="mt-8 border-t border-gray-100 pt-5 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">History</h2>
            {sortedDays.length > 0 && (
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-xs font-medium text-gray-400 underline-offset-2 transition-colors hover:text-red-500 hover:underline dark:text-gray-500 dark:hover:text-red-400"
              >
                Clear all
              </button>
            )}
          </div>

          {!historyLoaded && (
            <p className="text-xs text-gray-400 dark:text-gray-500">Loading history…</p>
          )}

          {historyLoaded && sortedDays.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Completed sessions will show up here, grouped by day.
            </p>
          )}

          {historyLoaded && sortedDays.length > 0 && (
            <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
              {sortedDays.map((key) => {
                const daySessions = history[key] || [];
                const dayTotal = daySessions.reduce((sum, s) => sum + s.minutes, 0);
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700/50 dark:bg-gray-700/40"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 dark:border-gray-600/50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                        {formatDateLabel(key)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {dayTotal} min total
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteDay(key)}
                          aria-label={`Delete history for ${formatDateLabel(key)}`}
                          className="text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {daySessions.map((session) => (
                        <li
                          key={session.id}
                          className="shadow-xs flex items-center justify-between rounded-md bg-white px-2.5 py-1.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <span className="font-medium">{session.minutes} min Focus</span>
                          <button
                            type="button"
                            onClick={() => deleteSession(key, session.id)}
                            aria-label={`Delete session of ${session.minutes} min`}
                            className="text-[10px] text-gray-300 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {historyError && (
            <p className="mt-2 text-xs text-red-500 dark:text-red-400">{historyError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
