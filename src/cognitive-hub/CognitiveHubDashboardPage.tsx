/**
 * CognitiveHubDashboardPage.tsx
 *
 * Progress Dashboard page for Cognitive Hub.
 * Clean, professional white background (#FFFFFF) with neutral surfaces and high-contrast typography.
 *
 * Route: /app/cognitive-hub/dashboard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Flame, Award } from 'lucide-react';
import { useCognitiveLabStore } from '../ether-thought-hub/src/stores/cognitive-lab-store';
import {
  PerformanceTimeline,
  CognitiveRadarChart,
} from '../ether-thought-hub/src/components/cognitive-lab/ProgressChart';
import { GAME_META } from '../ether-thought-hub/src/lib/cognitive-lab/constants';
import type { GameId } from '../ether-thought-hub/src/lib/cognitive-lab/types';

export const CognitiveHubDashboardPage: React.FC = () => {
  const store = useCognitiveLabStore();

  React.useEffect(() => {
    store.hydrate();
  }, []);

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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans p-4 sm:p-6 md:p-8 space-y-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Navigation */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
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
                  Cognitive Analytics &amp; Progress
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Detailed metrics, timeline trajectories, and neural skill balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 text-xs font-bold text-amber-900 dark:text-amber-200 shadow-sm">
              <span>🪙</span>
              <span>{store.coins} Coins</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-700/60 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-sm">
              <span>✓</span>
              <span>{store.completedGamesCount} Completed</span>
            </div>
          </div>
        </header>

        {/* 4 Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <Trophy className="w-5 h-5 text-amber-500 mb-2" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase block font-semibold">Total Points</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {overall.totalScore.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <Target className="w-5 h-5 text-indigo-600 dark:text-cyan-400 mb-2" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase block font-semibold">Avg Accuracy</span>
            <span className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-cyan-400">
              {overall.totalSessions > 0 ? `${overall.avgAccuracy}%` : '—'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <Flame className="w-5 h-5 text-rose-500 mb-2" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase block font-semibold">Modules Played</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {overall.gamesPlayed} / {totalModulesCount}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase block font-semibold">Total Sessions</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {overall.totalSessions}
            </span>
          </div>
        </section>

        {/* Visual Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Timeline */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Performance Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Score progress over recent game sessions</p>
            </div>
            <PerformanceTimeline results={resultsHistory} />
          </div>

          {/* Radar Balance Chart */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cognitive Balance Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skill breakdown across cognitive domains</p>
            </div>
            <CognitiveRadarChart categoryScores={categoryScores} />
          </div>
        </section>

        {/* Recent Session History Table */}
        <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Training Sessions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                <tr>
                  <th className="py-3 px-4 font-bold">Game</th>
                  <th className="py-3 px-4 font-bold">Difficulty</th>
                  <th className="py-3 px-4 font-bold">Score</th>
                  <th className="py-3 px-4 font-bold">Accuracy</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {resultsHistory.slice(0, 10).map((res) => {
                  const meta = GAME_META[res.gameId as GameId];
                  return (
                    <tr key={res.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-2 font-sans font-semibold text-slate-900 dark:text-slate-100">
                        <span>{meta?.icon}</span>
                        <span>{meta?.name || res.gameId}</span>
                      </td>
                      <td className="py-3 px-4 uppercase text-slate-500 dark:text-slate-400">
                        Level {res.difficulty}
                      </td>
                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-cyan-400">
                        {res.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.round(res.accuracy)}%
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(res.playedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}

                {resultsHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sans italic">
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
};

export default CognitiveHubDashboardPage;
