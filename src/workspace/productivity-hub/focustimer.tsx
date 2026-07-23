// frontend/src/workspace/productivity-hub/FocusTimer.tsx
import React, { useState, useEffect, useRef } from 'react';

interface FocusTimerProps {
  onSessionComplete: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const DEFAULT_TIME = 25 * 60; // 25-minute traditional modular productivity block
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleLifecycleCompletion();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleLifecycleCompletion = () => {
    if (timerRef.current) clearInterval(timerRef.current);
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
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? DEFAULT_TIME : 5 * 60);
  };

  const formatDisplayTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-center space-y-4">
      <div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono ${
          mode === 'focus' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {mode === 'focus' ? 'Deep Work Mode' : 'Recovery Buffer'}
        </span>
      </div>

      <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white select-none">
        {formatDisplayTime(timeLeft)}
      </div>

      <div className="flex items-center gap-3 w-full max-w-[240px]">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
            isActive 
              ? 'bg-amber-600 hover:bg-amber-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isActive ? 'Pause Block' : 'Initialize'}
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};