/**
 * CognitiveHubPage.tsx
 *
 * Primary entry page for Aether Cognitive Hub.
 * Clean, modern white background (#FFFFFF) with neutral surfaces (#F8FAFC, #F1F5F9, #E2E8F0)
 * and dark text with strong readability. Supports dark mode toggle via global Aether theme.
 *
 * Real scoring and persistence data from useCognitiveLabStore with zero fake data.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Trophy,
  Flame,
  Calendar,
  BarChart3,
  RotateCcw,
  Sparkles,
  Zap,
  Play,
  Award,
  ArrowRight,
} from 'lucide-react';

import { useCognitiveLabStore } from '../ether-thought-hub/src/stores/cognitive-lab-store';
import { getTodayDailyTraining } from '../ether-thought-hub/src/lib/cognitive-lab/daily';
import { GAME_META } from '../ether-thought-hub/src/lib/cognitive-lab/constants';
import type { GameId, GameMeta } from '../ether-thought-hub/src/lib/cognitive-lab/types';

// ─────────────────────────────────────────────────────────────────────────────
// GameCard — White Professional Aesthetic
// ─────────────────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: GameMeta;
  highScore: number;
  playCount: number;
  isDailyRecommended?: boolean;
}

function GameCard({ game, highScore, playCount, isDailyRecommended = false }: GameCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isDailyRecommended
          ? 'border-amber-400/60 bg-gradient-to-br from-amber-50/50 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-amber-500/5'
          : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Daily Training Tag */}
      {isDailyRecommended && (
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md">
          <Award className="h-3 w-3" /> Daily Challenge
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-2xl shadow-sm">
              <span role="img" aria-label={game.name}>
                {game.icon}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                {game.categoryLabel}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
                {game.name}
              </h3>
            </div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{game.description}</p>

        {/* Key Skills Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {game.keySkills.map((skill, idx) => (
            <span
              key={idx}
              className="rounded-lg border border-slate-200/70 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Performance info */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex flex-col text-xs">
          {highScore > 0 ? (
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Trophy className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{highScore.toLocaleString()}</span>
              <span className="text-slate-400 text-[11px]">pts</span>
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">No sessions yet</span>
          )}
          <span className="text-[11px] text-slate-400">
            {playCount > 0 ? `${playCount} session${playCount === 1 ? '' : 's'}` : 'Unplayed'}
          </span>
        </div>

        <Link
          to={`/app/cognitive-hub/${game.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all duration-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white group-hover:bg-indigo-600 group-hover:text-white"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Play</span>
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CognitiveHubPage — main hub page
// ─────────────────────────────────────────────────────────────────────────────

export const CognitiveHubPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useCognitiveLabStore();

  // Hydrate store from localStorage on mount
  React.useEffect(() => {
    store.hydrate();
  }, []);

  const overall = store.getOverallStats();
  const todayTraining = getTodayDailyTraining(store.dailyTraining);
  const gamesList: GameMeta[] = Object.values(GAME_META);

  const handleResetStats = () => {
    if (confirm('Reset all game stats and personal bests?')) {
      store.resetProgress();
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Ambient background subtle lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 dark:bg-indigo-900/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-100 dark:bg-cyan-900/30 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Navigation Bar ── */}
        <header className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 sm:flex-row">
          <div className="flex items-center gap-3.5">
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/70 p-3 text-indigo-600 dark:text-cyan-400 shadow-sm">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-cyan-400">AETHER</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Cognitive Hub
                </h1>
                <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Scientifically calibrated neural &amp; cognitive training suite
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Coin Wallet Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 text-xs font-extrabold text-amber-900 dark:text-amber-200 shadow-sm" title="Neural Training Coins">
              <span>🪙</span>
              <span>{store.coins}</span>
            </div>

            {/* Completed Modules Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-700/60 text-xs font-extrabold text-emerald-900 dark:text-emerald-200 shadow-sm" title="Completed Modules">
              <span>✓</span>
              <span>{store.completedGamesCount} Completed</span>
            </div>

            <Link
              to="/app/cognitive-hub/daily"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-300 shadow-sm transition-colors hover:bg-amber-100 dark:hover:bg-amber-500/20"
            >
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Daily Training</span>
            </Link>

            <Link
              to="/app/cognitive-hub/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
              <span>Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate('/app')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
              title="Return to Aether OS"
            >
              <span className="hidden md:inline">Aether OS</span>
            </button>
          </div>
        </header>

        {/* ── Phase 4 Hierarchy: Hero Section ── */}
        <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20 p-8 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/60 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Adaptive Cognitive Engine Active
              </div>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Cognitive Training
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Train memory, reaction, focus, logic, pattern recognition and strategic thinking with scientifically designed micro-challenges.
              </p>
            </div>

            {/* Real Stats Grid */}
            <div className="grid w-full flex-shrink-0 grid-cols-3 gap-3 md:w-auto">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 text-center shadow-sm">
                <Flame className="mx-auto mb-1 h-5 w-5 text-amber-500" />
                <span className="block font-mono text-xs uppercase font-medium text-slate-500 dark:text-slate-400">Avg Accuracy</span>
                <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                  {overall.totalSessions > 0 ? `${overall.avgAccuracy}%` : '—'}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 text-center shadow-sm">
                <Zap className="mx-auto mb-1 h-5 w-5 text-indigo-600 dark:text-cyan-400" />
                <span className="block font-mono text-xs uppercase font-medium text-slate-500 dark:text-slate-400">Sessions</span>
                <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                  {overall.totalSessions}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 text-center shadow-sm">
                <Trophy className="mx-auto mb-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="block font-mono text-xs uppercase font-medium text-slate-500 dark:text-slate-400">Total Score</span>
                <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
                  {overall.totalScore.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Daily Workout Banner ── */}
        <section className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-amber-300/80 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 p-6 shadow-sm md:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-amber-400/40 bg-amber-100/70 dark:bg-amber-500/10 p-3.5 text-amber-600 dark:text-amber-400 shadow-sm">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Today's Daily Workout</h3>
                {todayTraining.completed ? (
                  <span className="rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Completed ✓
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-300 dark:border-amber-500/40 bg-amber-100/60 dark:bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    {todayTraining.gamesCompleted.length} / {todayTraining.recommendedGames.length} Complete
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                4 curated challenges selected for {todayTraining.date}
              </p>
            </div>
          </div>

          <Link
            to="/app/cognitive-hub/daily"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 text-center text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all duration-150 active:scale-98 md:w-auto"
          >
            <span>{todayTraining.completed ? 'Review Daily Results' : 'Start Daily Workout'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* ── Game Grid ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Cognitive Training Modules
              </h2>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                {gamesList.length} Modules
              </span>
            </div>

            <button
              onClick={handleResetStats}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-rose-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Stats</span>
            </button>
          </div>

          {/* 8 Games Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gamesList.map((game: GameMeta) => {
              const isDaily = todayTraining.recommendedGames.includes(game.id);
              const bestScore = store.getBestScore(game.id) ?? 0;
              const stats = store.getPlayerStats(game.id);
              return (
                <GameCard
                  key={game.id}
                  game={game}
                  highScore={bestScore}
                  playCount={stats.totalSessions}
                  isDailyRecommended={isDaily}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CognitiveHubPage;
