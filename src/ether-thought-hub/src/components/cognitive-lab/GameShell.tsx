import React, { useEffect } from "react";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import { DIFFICULTY_LABELS } from "../../lib/cognitive-lab/constants";
import type { DifficultyLevel } from "../../lib/cognitive-lab/types";
import { StreakBadge } from "./FeedbackEffects";

interface GameShellProps {
  title: string;
  categoryName: string;
  categoryIcon: string;
  difficulty: DifficultyLevel;
  score: number;
  streak: number;
  timeLeft: number;
  maxTime?: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export function GameShell({
  title,
  categoryName,
  categoryIcon,
  difficulty,
  score,
  streak,
  timeLeft,
  maxTime,
  isPaused,
  onPauseToggle,
  onRestart,
  onBack,
  children,
}: GameShellProps) {
  // Keyboard pause shortcut (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPauseToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPauseToggle]);

  const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;
  const isTimeWarning = timeLeft <= 10 && timeLeft > 0;
  const timeProgress = maxTime ? Math.max(0, Math.min(100, (timeLeft / maxTime) * 100)) : 100;

  return (
    <div className="cognitive-lab-shell min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col relative overflow-hidden font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Back to Hub"
              aria-label="Back to Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-hidden="true">{categoryIcon}</span>
                <h1 className="font-bold text-lg md:text-xl text-slate-900 dark:text-slate-100 tracking-tight">{title}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {DIFFICULTY_LABELS[difficulty]}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">{categoryName}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 sm:gap-6">
            <StreakBadge streak={streak} />

            {/* Score */}
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono font-medium">Score</span>
              <span className="text-xl font-bold font-mono text-indigo-600 dark:text-cyan-400">{score.toLocaleString()}</span>
            </div>

            {/* Timer */}
            <div className="text-right min-w-[60px]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono font-medium">Time</span>
              <span
                className={`text-xl font-bold font-mono ${
                  isTimeWarning ? "text-rose-600 dark:text-rose-400 animate-pulse" : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {formattedTime}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
              <button
                onClick={onPauseToggle}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title={isPaused ? "Resume" : "Pause"}
                aria-label={isPaused ? "Resume game" : "Pause game"}
              >
                {isPaused ? <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={onRestart}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Restart Game"
                aria-label="Restart Game"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar under header */}
        {maxTime && (
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 absolute bottom-0 left-0 right-0 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 linear ${
                isTimeWarning ? "bg-rose-500" : "bg-indigo-600 dark:bg-cyan-500"
              }`}
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Game Playing Canvas Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center items-center relative z-10">
        {children}
      </main>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Game Paused</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Take a breath! Press Escape or click Resume to continue training.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onPauseToggle}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-98"
              >
                <Play className="w-5 h-5 fill-current" />
                Resume Training
              </button>
              <button
                onClick={onRestart}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                Restart Session
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm transition-colors"
              >
                Exit to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
