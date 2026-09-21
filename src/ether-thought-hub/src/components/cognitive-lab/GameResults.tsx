import { useEffect, useState } from "react";
import type { GameResult } from "../../lib/cognitive-lab/types";
import { DIFFICULTY_LABELS } from "../../lib/cognitive-lab/constants";
import { calcStarRating } from "../../lib/cognitive-lab/scoring";

interface GameResultsProps {
  result: GameResult;
  bestScore?: number | null;
  personalBest?: number | null;
  gameTitle?: string;
  onReplay: () => void;
  onExit: () => void;
}

function formatMs(ms: number): string {
  if (!ms || ms === 0) return "—";
  if (ms < 1000) return `${String(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function GameResults({ result, bestScore, personalBest, gameTitle, onReplay, onExit }: GameResultsProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const effectiveBestScore = bestScore ?? personalBest ?? null;
  const isSuccessful = (result.scorePercentage ?? Math.round(result.accuracy)) >= 60;

  const stars = calcStarRating({
    accuracy: result.accuracy,
    difficulty: result.difficulty,
    avgResponseTimeMs: result.avgResponseTimeMs,
  });

  const isNewBest = effectiveBestScore === null || result.score > effectiveBestScore;

  // Animate score count-up
  useEffect(() => {
    const target = result.score;
    const duration = 800;
    const start = performance.now();
    let raf: number;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [result.score]);

  return (
    <div className="lab-page-enter flex min-h-dvh flex-col items-center justify-center p-4 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
        {gameTitle && (
          <h2 className="text-center text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {gameTitle}
          </h2>
        )}

        {/* Success / Failure Threshold Banner */}
        {isSuccessful ? (
          <div className="text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-sm animate-fade-in">
            <p className="font-extrabold text-base">Successfully Completed!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Great work.</p>
          </div>
        ) : (
          <div className="text-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 shadow-sm animate-fade-in">
            <p className="font-extrabold text-base">Not Successfully Completed.</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">Better luck next time!</p>
          </div>
        )}

        {/* Coins & Personal Best Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {result.coinsEarned > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-black shadow-xs">
              <span>🪙</span>
              <span>+{result.coinsEarned} Coins Earned</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
              <span>🪙</span>
              <span>0 Coins Earned</span>
            </div>
          )}

          {isNewBest && (
            <div className="inline-flex items-center gap-1 text-xs font-bold py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-cyan-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
              🎉 New Best!
            </div>
          )}
        </div>

        {/* Score & Percentage Display */}
        <div className="flex flex-col items-center gap-1 py-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Final Score
          </p>
          <div className="text-5xl font-black tracking-tight text-indigo-600 dark:text-cyan-400 font-mono">
            {displayScore.toLocaleString()}
          </div>

          <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Score Result:</span>
            <span className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
              {result.scorePercentage ?? Math.round(result.accuracy)}%
            </span>
          </div>

          {/* Stars */}
          <div className="flex gap-1.5 mt-2" aria-label={`${String(stars)} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-2xl transition-colors ${
                  s <= stars ? "text-amber-400 drop-shadow-sm" : "text-slate-300 dark:text-slate-700"
                }`}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <hr className="border-t border-slate-200 dark:border-slate-800 my-0" />

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatBox label="Accuracy" value={`${String(Math.round(result.accuracy))}%`} />
          <StatBox
            label="Duration"
            value={formatMs(result.durationMs)}
          />
          {result.mistakes !== undefined && (
            <StatBox label="Mistakes" value={String(result.mistakes)} />
          )}
          {result.hintsUsed !== undefined && (
            <StatBox label="Hints Used" value={String(result.hintsUsed)} />
          )}
          <StatBox label="Avg Response" value={formatMs(result.avgResponseTimeMs)} />
          <StatBox label="Best Streak" value={`${String(result.maxStreak)}x`} />
          <StatBox
            label="Difficulty"
            value={DIFFICULTY_LABELS[result.difficulty]}
            className={result.mistakes === undefined && result.hintsUsed === undefined ? "col-span-2" : ""}
          />
        </div>

        {/* Previous best */}
        {effectiveBestScore !== null && !isNewBest && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Personal best: {effectiveBestScore.toLocaleString()}
          </p>
        )}

        <hr className="border-t border-slate-200 dark:border-slate-800 my-0" />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onReplay}
            autoFocus
          >
            Play Again
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
            onClick={onExit}
          >
            Return to Cognitive Hub
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
    >
      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
        {value}
      </span>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {label}
      </span>
    </div>
  );
}
