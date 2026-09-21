import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { GameId } from "@/lib/cognitive-lab/types";
import { FocusLockGame } from "@/components/cognitive-lab/games/FocusLock";
import { MemoryMatrixGame } from "@/components/cognitive-lab/games/MemoryMatrix";
import { LogicForgeGame } from "@/components/cognitive-lab/games/LogicForge";
import { PatternShiftGame } from "@/components/cognitive-lab/games/PatternShift";
import { SequenceCoreGame } from "@/components/cognitive-lab/games/SequenceCore";
import { ReactionControlGame } from "@/components/cognitive-lab/games/ReactionControl";
import { StrategyGridGame } from "@/components/cognitive-lab/games/StrategyGrid";
import { CodeBreakerGame } from "@/components/cognitive-lab/games/CodeBreaker";
import { SudokuGame } from "@/components/cognitive-lab/games/Sudoku";
import { LogicGridGame } from "@/components/cognitive-lab/games/LogicGrid";

export const Route = createFileRoute("/cognitive-lab/$gameId")({
  component: CognitiveLabGameRoute,
});

function CognitiveLabGameRoute() {
  const { gameId } = Route.useParams();

  switch (gameId as GameId) {
    case "focus-lock":
      return <FocusLockGame />;
    case "memory-matrix":
      return <MemoryMatrixGame />;
    case "logic-forge":
      return <LogicForgeGame />;
    case "pattern-shift":
      return <PatternShiftGame />;
    case "sequence-core":
      return <SequenceCoreGame />;
    case "reaction-control":
      return <ReactionControlGame />;
    case "strategy-grid":
      return <StrategyGridGame />;
    case "code-breaker":
      return <CodeBreakerGame />;
    case "sudoku":
      return <SudokuGame />;
    case "logic-grid":
      return <LogicGridGame />;
    default:
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-slate-100">Game Not Found</h2>
            <p className="text-sm text-slate-400">
              The requested cognitive game module "{gameId}" does not exist.
            </p>
            <Link
              to="/cognitive-lab"
              className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
            >
              Return to Game Hub
            </Link>
          </div>
        </div>
      );
  }
}
