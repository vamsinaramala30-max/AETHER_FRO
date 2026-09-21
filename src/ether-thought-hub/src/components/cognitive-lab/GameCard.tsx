import React from "react";
import { Link } from "react-router-dom";
import { Play, Trophy, Award } from "lucide-react";
import type { GameMeta } from "../../lib/cognitive-lab/types";

interface GameCardProps {
  game: GameMeta;
  highScore: number;
  playCount: number;
  isDailyRecommended?: boolean;
}

export function GameCard({
  game,
  highScore,
  playCount,
  isDailyRecommended = false,
}: GameCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDailyRecommended
          ? "border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 shadow-amber-500/5"
          : "border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      {/* Daily Training Tag */}
      {isDailyRecommended && (
        <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
          <Award className="w-3 h-3" /> Daily Challenge
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl bg-slate-800 border border-slate-700">
              <span role="img" aria-label={game.name}>
                {game.icon}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {game.categoryLabel}
              </span>
              <h3 className="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                {game.name}
              </h3>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {game.description}
        </p>

        {/* Cognitive Benefits / Skills Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {game.keySkills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer with Stats & Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5" title="Personal Best">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-slate-200">{highScore.toLocaleString()}</span>
          </div>
          <div>
            <span>{playCount} plays</span>
          </div>
        </div>

        <Link
          to={`/app/cognitive-hub/${game.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white font-medium text-sm transition-all duration-200 group-hover:bg-cyan-600 group-hover:text-white shadow-md"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play</span>
        </Link>
      </div>
    </div>
  );
}
