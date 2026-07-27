// frontend/src/workspace/productivity-hub/FocusTimer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface FocusTimerProps {
  onSessionComplete: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const DEFAULT_TIME = 25 * 60; // 25-minute traditional modular productivity block
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLifecycleCompletion = useCallback(() => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    setIsActive(false);

    if (mode === 'focus') {
      onSessionComplete(25);
      alert('Focus sequence terminated successfully. Transitioning to recovery layer.');
      setMode('break');
      setTimeLeft(5 * 60); // 5 minute recovery interval
    } else {
      alert('Recovery session complete. Ready to spin up core threads.');
      setMode('focus');
      setTimeLeft(DEFAULT_TIME);
    }
  }, [mode, onSessionComplete, DEFAULT_TIME]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleLifecycleCompletion();
    }

    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleLifecycleCompletion]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? DEFAULT_TIME : 5 * 60);
  };

  const formatDisplayTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 text-center backdrop-blur-sm">
      <div>
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider ${
            mode === 'focus'
              ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
              : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          }`}
        >
          {mode === 'focus' ? 'Deep Work Mode' : 'Recovery Buffer'}
        </span>
      </div>

      <div className="select-none font-mono text-4xl font-black tracking-tight text-white sm:text-5xl">
        {formatDisplayTime(timeLeft)}
      </div>

      <div className="flex w-full max-w-[240px] items-center gap-3">
        <button
          onClick={toggleTimer}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold shadow-sm transition-colors ${
            isActive
              ? 'bg-amber-600 text-white hover:bg-amber-500'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isActive ? 'Pause Block' : 'Initialize'}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
