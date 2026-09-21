import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import type { GameResult } from "../../lib/cognitive-lab/types";
import { COGNITIVE_CATEGORIES } from "../../lib/cognitive-lab/constants";

interface PerformanceTimelineProps {
  results: GameResult[];
}

export function PerformanceTimeline({ results }: PerformanceTimelineProps) {
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
        <p className="text-sm">No training data recorded yet.</p>
        <p className="text-xs text-slate-500 mt-1">Complete game sessions to see your score trajectory!</p>
      </div>
    );
  }

  // Format data for timeline (sorted chronologically)
  const chartData = [...results]
    .sort((a, b) => a.playedAt - b.playedAt)
    .slice(-15)
    .map((r, i) => ({
      index: i + 1,
      date: new Date(r.playedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      score: r.score,
      accuracy: Math.round(r.accuracy),
      game: r.gameId,
    }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "12px",
              color: "#f8fafc",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CognitiveRadarProps {
  categoryScores: Record<string, number>;
}

export function CognitiveRadarChart({ categoryScores }: CognitiveRadarProps) {
  const radarData = Object.values(COGNITIVE_CATEGORIES).map((cat) => ({
    category: cat.name,
    score: categoryScores[cat.id] || 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
          <Radar
            name="Cognitive Score"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
