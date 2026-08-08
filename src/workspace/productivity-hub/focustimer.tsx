import React, { useCallback, useEffect, useRef, useState } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

const MIN_MINUTES = 1;
const MAX_MINUTES = 180;
const DEFAULT_MINUTES = 25;

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function playCompletionSound(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();

    const tones = [
      { frequency: 523.25, startOffset: 0, duration: 0.18 }, // C5
      { frequency: 659.25, startOffset: 0.16, duration: 0.18 }, // E5
      { frequency: 783.99, startOffset: 0.32, duration: 0.32 }, // G5
    ];

    tones.forEach(({ frequency, startOffset, duration }) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      const startTime = audioContext.currentTime + startOffset;
      const endTime = startTime + duration;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(endTime + 0.05);
    });

    const totalDuration = Math.max(...tones.map((t) => t.startOffset + t.duration)) + 0.2;
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

interface FocusTimerProps {
  onSessionComplete?: (minutes: number) => void;
}

export default function FocusTimer({ onSessionComplete }: FocusTimerProps): React.ReactElement {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(DEFAULT_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_MINUTES * 60);
  const [status, setStatus] = useState<TimerStatus>('idle');

  const endTimestampRef = useRef<number | null>(null);
  const remainingAtPauseRef = useRef<number>(DEFAULT_MINUTES * 60);
  const intervalRef = useRef<number | null>(null);

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
    onSessionComplete?.(selectedMinutes);

    setStatus('idle');
    setRemainingSeconds(selectedMinutes * 60);
    remainingAtPauseRef.current = selectedMinutes * 60;
  }, [clearTick, selectedMinutes, onSessionComplete]);

  const tick = useCallback(() => {
    if (endTimestampRef.current === null) {
      return;
    }
    const msRemaining = endTimestampRef.current - Date.now();
    const secondsRemaining = Math.ceil(msRemaining / 1000);

    if (secondsRemaining <= 0) {
      finishTimer();
      return;
    }
    setRemainingSeconds(secondsRemaining);
  }, [finishTimer]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }
    intervalRef.current = window.setInterval(tick, 250);
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

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, value));
    setSelectedMinutes(clamped);
  };

  const handleStart = () => {
    if (status === 'running') {
      return;
    }
    const startSeconds = status === 'paused' ? remainingAtPauseRef.current : selectedMinutes * 60;
    endTimestampRef.current = Date.now() + startSeconds * 1000;
    setRemainingSeconds(startSeconds);
    setStatus('running');
  };

  const handlePause = () => {
    if (status !== 'running') {
      return;
    }
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
    if (status !== 'paused') {
      return;
    }
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

  useEffect(() => {
    return () => {
      clearTick();
    };
  }, [clearTick]);

  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transition-colors dark:bg-gray-800 sm:p-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl">
          Focus Timer
        </h1>

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
      </div>
    </div>
  );
}
