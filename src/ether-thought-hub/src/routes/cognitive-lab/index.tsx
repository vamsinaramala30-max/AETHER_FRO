import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Trophy,
  Flame,
  Calendar,
  BarChart3,
  Bot,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { GAME_META } from "@/lib/cognitive-lab/constants";
import { GameCard } from "@/components/cognitive-lab/GameCard";
import { HubBackground } from "@/components/cognitive-lab/HubBackground";
import { useCognitiveLabStore } from "@/stores/cognitive-lab-store";
import { getTodayDailyTraining } from "@/lib/cognitive-lab/daily";
import type { GameId } from "@/lib/cognitive-lab/types";

export const Route = createFileRoute("/cognitive-lab/")({
  component: CognitiveLabHub,
});

function CognitiveLabHub() {
  const store = useCognitiveLabStore();
  const overall = store.getOverallStats();
  const todayTraining = getTodayDailyTraining(store.dailyTraining);
  const gamesList = Object.values(GAME_META);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Background Particle Effects */}
      <HubBackground />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  AETHER Cognitive Lab
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono font-semibold border border-cyan-800/50">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Scientifically calibrated neural & cognitive training suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cognitive-lab/daily"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Training</span>
            </Link>

            <Link
              to="/cognitive-lab/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-sm font-medium transition-colors"
              title="Return to AI Chat"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden md:inline">AI Workspace</span>
            </Link>
          </div>
        </header>

        {/* Hero Section & Player Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive Cognitive Engine Active
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                Sharpen focus, working memory & strategic agility.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Complete daily cognitive workouts across selective attention, pattern recognition, spatial reasoning, and deduction.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto flex-shrink-0">
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-mono uppercase block">Accuracy</span>
                <span className="text-xl font-bold font-mono text-slate-100">
                  {overall.avgAccuracy}%
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-center">
                <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-mono uppercase block">Sessions</span>
                <span className="text-xl font-bold font-mono text-slate-100">
                  {overall.totalSessions}
                </span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-center">
                <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 font-mono uppercase block">Total Score</span>
                <span className="text-xl font-bold font-mono text-slate-100">
                  {overall.totalScore.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Workout Banner */}
        <section className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100">Today's Daily Workout</h3>
                {todayTraining.completed ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                    Completed ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    {todayTraining.gamesCompleted.length} / {todayTraining.recommendedGames.length} Complete
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                4 curated challenges selected for date {todayTraining.date}
              </p>
            </div>
          </div>

          <Link
            to="/cognitive-lab/daily"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 text-center"
          >
            {todayTraining.completed ? "Review Daily Results" : "Start Daily Workout"}
          </Link>
        </section>

        {/* Game Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                All Cognitive Modules
              </h2>
              <span className="text-xs text-slate-400 font-mono">({gamesList.length} Games)</span>
            </div>

            <button
              onClick={() => {
                if (confirm("Reset all game stats and personal bests?")) {
                  store.resetProgress();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Stats</span>
            </button>
          </div>

          {/* Grid of 8 Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamesList.map((game) => {
              const isDaily = todayTraining.recommendedGames.includes(game.id as GameId);
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
}
