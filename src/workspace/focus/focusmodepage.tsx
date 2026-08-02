import React from 'react';
import { Target, Play, Pause, RotateCcw } from 'lucide-react';

export const FocusModePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center space-y-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight text-white">
          <Target className="h-8 w-8 text-purple-500" />
          Focus & Pomodoro Session
        </h1>
        <p className="text-sm text-slate-400">
          Eliminate distractions, block notifications, and enter deep work state.
        </p>
      </div>

      <div className="relative my-8 flex items-center justify-center">
        <div className="flex h-72 w-72 flex-col items-center justify-center rounded-full border-4 border-[#1E2638] bg-[#0C101C] shadow-2xl shadow-purple-900/20">
          <span className="font-mono text-5xl font-bold tracking-widest text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            {isRunning ? 'Deep Work Active' : 'Session Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-900/30 transition-all hover:opacity-95"
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isRunning ? 'Pause Timer' : 'Start Focus'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}
          className="rounded-xl border border-[#1E2638] bg-[#141B2D] p-3 text-slate-400 transition-colors hover:text-white"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
