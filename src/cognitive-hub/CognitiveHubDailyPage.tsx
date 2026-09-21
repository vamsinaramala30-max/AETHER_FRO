/**
 * CognitiveHubDailyPage.tsx
 *
 * Daily Training page for Cognitive Hub.
 * Clean, professional white background (#FFFFFF) with neutral surfaces and high-contrast typography.
 *
 * Route: /app/cognitive-hub/daily
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Play, Sparkles } from 'lucide-react';
import { useCognitiveLabStore } from '../ether-thought-hub/src/stores/cognitive-lab-store';
import { getTodayDailyTraining } from '../ether-thought-hub/src/lib/cognitive-lab/daily';
import { GAME_META } from '../ether-thought-hub/src/lib/cognitive-lab/constants';
import type { GameId } from '../ether-thought-hub/src/lib/cognitive-lab/types';

export const CognitiveHubDailyPage: React.FC = () => {
  const store = useCognitiveLabStore();

  React.useEffect(() => {
    store.hydrate();
  }, []);

  const todayTraining = getTodayDailyTraining(store.dailyTraining);

  const completedCount = todayTraining.gamesCompleted.length;
  const totalCount = todayTraining.recommendedGames.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans p-4 sm:p-6 md:p-8 space-y-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/app/cognitive-hub"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              aria-label="Back to Cognitive Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-cyan-400">AETHER</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Daily Training
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Session Date: {todayTraining.date}</p>
            </div>
          </div>
        </header>

        {/* Workout Status Banner */}
        <section className="bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-300/80 dark:border-amber-500/30 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 dark:bg-amber-500/10 border border-amber-300/60 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Today's Cognitive Program</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Complete all {totalCount} calibrated challenges for today's workout target.
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {completedCount}/{totalCount}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase font-medium">Completed</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {todayTraining.completed && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold shadow-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                Outstanding! You have completed all prescribed cognitive training modules for today.
              </span>
            </div>
          )}
        </section>

        {/* List of Prescribed Games */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Prescribed Workouts</h3>

          <div className="grid grid-cols-1 gap-4">
            {todayTraining.recommendedGames.map((gameId: GameId, idx: number) => {
              const game = GAME_META[gameId];
              const isDone = todayTraining.gamesCompleted.includes(gameId);

              if (!game) return null;

              return (
                <div
                  key={gameId}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl border transition-all ${
                    isDone
                      ? 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl font-bold shadow-sm">
                      {game.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-cyan-400">
                          Step {idx + 1}
                        </span>
                        <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{game.name}</h4>
                        {isDone && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                            Completed ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{game.description}</p>
                    </div>
                  </div>

                  <Link
                    to={`/app/cognitive-hub/${game.id}`}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
                      isDone
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isDone ? 'Replay Module' : 'Start Challenge'}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CognitiveHubDailyPage;
