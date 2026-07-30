import React from 'react';
import { Target, Play, Pause, RotateCcw, Volume2, Shield } from 'lucide-react';

export const FocusModePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[80vh]">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-purple-500" />
          Focus & Pomodoro Session
        </h1>
        <p className="text-sm text-slate-400">
          Eliminate distractions, block notifications, and enter deep work state.
        </p>
      </div>

      <div className="my-8 relative flex items-center justify-center">
        <div className="w-72 h-72 rounded-full border-4 border-[#1E2638] bg-[#0C101C] flex flex-col items-center justify-center shadow-2xl shadow-purple-900/20">
          <span className="text-5xl font-mono font-bold tracking-widest text-white">{formatTime(timeLeft)}</span>
          <span className="text-xs text-purple-400 font-semibold mt-2 uppercase tracking-wider">
            {isRunning ? 'Deep Work Active' : 'Session Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/30 hover:opacity-95 transition-all flex items-center gap-2"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pause Timer' : 'Start Focus'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}
          className="p-3 bg-[#141B2D] border border-[#1E2638] text-slate-400 hover:text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
