import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, CheckCircle, Play } from "lucide-react";
import { useCognitiveLabStore } from "@/stores/cognitive-lab-store";
import { getTodayDailyTraining } from "@/lib/cognitive-lab/daily";
import { GAME_META } from "@/lib/cognitive-lab/constants";

export const Route = createFileRoute("/cognitive-lab/daily")({
  component: CognitiveLabDaily,
});

function CognitiveLabDaily() {
  const store = useCognitiveLabStore();
  const todayTraining = getTodayDailyTraining(store.dailyTraining);

  const completedCount = todayTraining.gamesCompleted.length;
  const totalCount = todayTraining.recommendedGames.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 md:p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/cognitive-lab"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Daily Workout</h1>
              <p className="text-xs text-slate-400">Date: {todayTraining.date}</p>
            </div>
          </div>
        </header>

        {/* Workout Status Banner */}
        <section className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-100">Today's Cognitive Program</h2>
                <p className="text-xs text-slate-400">
                  Complete all {totalCount} games for today's workout target!
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-amber-400">
                {completedCount}/{totalCount}
              </span>
              <span className="text-xs text-slate-400 block uppercase">Done</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {todayTraining.completed && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-3 text-emerald-300 text-sm font-semibold">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                Awesome job! You have completed today's daily workout program. Come back tomorrow for new challenges!
              </span>
            </div>
          )}
        </section>

        {/* List of Prescribed Games */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Prescribed Workouts</h3>

          <div className="grid grid-cols-1 gap-4">
            {todayTraining.recommendedGames.map((gameId, idx) => {
              const game = GAME_META[gameId];
              const isDone = todayTraining.gamesCompleted.includes(gameId);

              if (!game) return null;

              return (
                <div
                  key={gameId}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border transition-all ${
                    isDone
                      ? "bg-slate-900/60 border-slate-800 text-slate-400"
                      : "bg-slate-900 border-amber-500/30 hover:border-amber-500/60 text-slate-100 shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl font-bold">
                      {game.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-slate-400">
                          Step {idx + 1}
                        </span>
                        <h4 className="font-bold text-lg text-slate-100">{game.name}</h4>
                        {isDone && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
                            Completed ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{game.description}</p>
                    </div>
                  </div>

                  <Link
                    to="/cognitive-lab/$gameId"
                    params={{ gameId: game.id }}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      isDone
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isDone ? "Replay Session" : "Start Workout"}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
