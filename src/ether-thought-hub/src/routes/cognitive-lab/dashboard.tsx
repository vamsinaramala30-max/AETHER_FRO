import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Target, Flame, Award } from "lucide-react";
import { useCognitiveLabStore } from "@/stores/cognitive-lab-store";
import { PerformanceTimeline, CognitiveRadarChart } from "@/components/cognitive-lab/ProgressChart";
import { GAME_META } from "@/lib/cognitive-lab/constants";
import type { GameId } from "@/lib/cognitive-lab/types";

export const Route = createFileRoute("/cognitive-lab/dashboard")({
  component: CognitiveLabDashboard,
});

function CognitiveLabDashboard() {
  const store = useCognitiveLabStore();
  const overall = store.getOverallStats();
  const resultsHistory = store.results;

  // Category score computation
  const categoryScores: Record<string, number> = {
    attention: 0,
    memory: 0,
    reasoning: 0,
    processing: 0,
    planning: 0,
    deduction: 0,
  };

  resultsHistory.forEach((r) => {
    const meta = GAME_META[r.gameId as GameId];
    if (meta) {
      const catKey = meta.category;
      categoryScores[catKey] = Math.max(categoryScores[catKey] || 0, r.score);
    }
  });

  const totalModulesCount = Object.keys(GAME_META).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Navigation */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/cognitive-lab"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Progress &amp; Analytics</h1>
              <p className="text-xs text-slate-400">Detailed metrics, timeline, and cognitive balance</p>
            </div>
          </div>
        </header>

        {/* 4 Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <Trophy className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-xs text-slate-400 font-mono uppercase block">Total Points</span>
            <span className="text-2xl font-bold font-mono text-slate-100">
              {overall.totalScore.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <Target className="w-5 h-5 text-cyan-400 mb-2" />
            <span className="text-xs text-slate-400 font-mono uppercase block">Avg Accuracy</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">{overall.avgAccuracy}%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <Flame className="w-5 h-5 text-rose-400 mb-2" />
            <span className="text-xs text-slate-400 font-mono uppercase block">Modules Played</span>
            <span className="text-2xl font-bold font-mono text-slate-100">
              {overall.gamesPlayed} / {totalModulesCount}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <Award className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-xs text-slate-400 font-mono uppercase block">Total Sessions</span>
            <span className="text-2xl font-bold font-mono text-slate-100">{overall.totalSessions}</span>
          </div>
        </section>

        {/* Visual Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Performance Trajectory</h3>
              <p className="text-xs text-slate-400">Score progress over recent game sessions</p>
            </div>
            <PerformanceTimeline results={resultsHistory} />
          </div>

          {/* Radar Balance Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Cognitive Balance Radar</h3>
              <p className="text-xs text-slate-400">Skill breakdown across cognitive domains</p>
            </div>
            <CognitiveRadarChart categoryScores={categoryScores} />
          </div>
        </section>

        {/* Recent Session History Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100">Recent Training Sessions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {resultsHistory.slice(0, 10).map((res) => {
                  const meta = GAME_META[res.gameId as GameId];
                  return (
                    <tr key={res.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-2 font-sans font-semibold">
                        <span>{meta?.icon}</span>
                        <span>{meta?.name || res.gameId}</span>
                      </td>
                      <td className="py-3 px-4 uppercase text-slate-400">Level {res.difficulty}</td>
                      <td className="py-3 px-4 font-bold text-cyan-400">{res.score.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-400">{Math.round(res.accuracy)}%</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(res.playedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}

                {resultsHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                      No game history recorded yet. Complete game sessions to see them here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
