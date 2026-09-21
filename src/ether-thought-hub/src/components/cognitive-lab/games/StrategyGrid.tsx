import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  RotateCcw,
  Undo2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Lightbulb,
  Flag,
} from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateStrategyGridChallenge,
  scorePath,
  posKey,
  neighbors,
  bfsDistance,
  type StrategyGridChallenge,
  type Pos,
} from "../../../lib/cognitive-lab/engines/strategy-grid";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult, RoundResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["strategy-grid"];

export function StrategyGridGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<StrategyGridChallenge | null>(null);
  const [playerPath, setPlayerPath] = useState<Pos[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);
  const [roundsHistory, setRoundsHistory] = useState<RoundResult[]>([]);

  const roundStartRef = useRef<number>(0);
  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("strategy-grid");
  const hintCost = store.getHintCost();

  const totalTargets = challenge?.targets.length || 0;
  const currentPos = playerPath[playerPath.length - 1];
  const sortedTargets = challenge ? [...challenge.targets].sort((a, b) => a.number - b.number) : [];

  let visitedCount = 0;
  if (challenge) {
    let targetIdx = 0;
    for (const p of playerPath) {
      const exp = sortedTargets[targetIdx];
      if (exp && p.row === exp.row && p.col === exp.col) {
        targetIdx++;
      }
    }
    visitedCount = targetIdx;
  }

  const nextTarget = sortedTargets[visitedCount] ?? null;

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setMistakesCount(0);
    setHintsUsed(0);
    setTimeLeft(75);
    setIsPaused(false);
    setWarningMessage(null);
    setStatusMessage(null);
    setRoundsHistory([]);
    const initialChallenge = generateStrategyGridChallenge(diff);
    setChallenge(initialChallenge);
    setPlayerPath([initialChallenge.startPos]);
    roundStartRef.current = performance.now();
    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    let levelCompletionRate = 0;
    if (challenge && totalTargets > 0) {
      levelCompletionRate = visitedCount / totalTargets;
    }
    const totalCompleted = correctCount + (levelCompletionRate >= 1 ? 0 : levelCompletionRate * 0.5);
    const effectiveRounds = Math.max(1, totalRounds + (levelCompletionRate > 0 && levelCompletionRate < 1 ? 1 : 0));
    const accuracy = Math.min(100, Math.round((totalCompleted / effectiveRounds) * 100));
    const scorePercentage = accuracy;
    const durationMs = (75 - timeLeft) * 1000;
    const attemptId = `stratgrid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const avgResponseTimeMs =
      roundsHistory.length > 0
        ? Math.round(
            roundsHistory.reduce((sum, r) => sum + r.responseTimeMs, 0) / roundsHistory.length
          )
        : 800;

    const result: GameResult = {
      id: attemptId,
      gameId: "strategy-grid",
      playedAt: Date.now(),
      difficulty,
      totalRounds: Math.max(1, totalRounds),
      correctRounds: correctCount,
      score,
      scorePercentage,
      isSuccess: scorePercentage >= 60,
      coinsEarned,
      hintsUsed,
      mistakes: mistakesCount,
      accuracy,
      avgResponseTimeMs,
      maxStreak,
      durationMs,
      rounds: roundsHistory,
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, visitedCount, totalTargets, challenge, score, timeLeft, maxStreak, difficulty, hintsUsed, mistakesCount, roundsHistory, store]);

  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused, finishGame]);

  const handleCellClick = (r: number, c: number) => {
    if (!challenge || !currentPos) return;

    // Check if cell is an obstacle
    const cell = challenge.grid[r]?.[c];
    if (cell?.type === "obstacle") {
      setWarningMessage("Obstacle cell: cannot pass through rock hazard!");
      setTimeout(() => setWarningMessage(null), 1800);
      return;
    }

    // Backtrack if player clicks the immediately previous cell
    if (playerPath.length > 1) {
      const prevPos = playerPath[playerPath.length - 2];
      if (prevPos && prevPos.row === r && prevPos.col === c) {
        setPlayerPath((prev) => prev.slice(0, -1));
        return;
      }
    }

    // Check adjacency (cardinal steps only)
    const isAdjacent = Math.abs(currentPos.row - r) + Math.abs(currentPos.col - c) === 1;
    if (!isAdjacent) {
      setWarningMessage("Step to an adjacent tile (up, down, left, right).");
      setTimeout(() => setWarningMessage(null), 1800);
      return;
    }

    // Check if player is landing on an out-of-order target
    if (cell?.type === "target" && cell.targetNumber !== undefined) {
      const expectedTargetNumber = visitedCount + 1;
      if (cell.targetNumber > expectedTargetNumber) {
        setWarningMessage(`Targets must be visited in order: Next is T${expectedTargetNumber}!`);
        setMistakesCount((prev) => prev + 1);
        setTimeout(() => setWarningMessage(null), 2200);
      }
    }

    const updatedPath = [...playerPath, { row: r, col: c }];
    setPlayerPath(updatedPath);

    // Evaluate if full sequence completed
    const evalResult = scorePath(challenge, updatedPath);
    if (evalResult.valid) {
      const responseTimeMs = Math.round(performance.now() - roundStartRef.current);
      const movesTaken = updatedPath.length - 1;
      const efficiencyBonus = Math.max(0, (challenge.maxMoves - movesTaken) * 15);

      const roundIdx = totalRounds + 1;
      setTotalRounds(roundIdx);
      setCorrectCount((prev) => prev + 1);

      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      const basePts = calcRoundScore({
        correct: true,
        responseTimeMs,
        difficulty,
        streak: newStreak,
      });

      const totalRoundScore = basePts + efficiencyBonus;
      setScore((prev) => prev + totalRoundScore);
      setFeedback("correct");

      setRoundsHistory((prev) => [
        ...prev,
        {
          roundIndex: roundIdx,
          correct: true,
          responseTimeMs,
          score: totalRoundScore,
        },
      ]);

      setTimeout(() => {
        setFeedback(null);
        setWarningMessage(null);
        const next = generateStrategyGridChallenge(difficulty);
        setChallenge(next);
        setPlayerPath([next.startPos]);
        roundStartRef.current = performance.now();
      }, 700);
    }
  };

  const handleHint = () => {
    if (!challenge || !currentPos || !nextTarget) return;
    const res = store.requestHint();
    if (!res.success) {
      setStatusMessage(res.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    setHintsUsed((prev) => prev + 1);

    const obstacles = new Set<string>();
    for (let r = 0; r < challenge.gridSize; r++) {
      for (let c = 0; c < challenge.gridSize; c++) {
        if (challenge.grid[r][c].type === "obstacle") {
          obstacles.add(posKey({ row: r, col: c }));
        }
      }
    }

    const validNeighbors = neighbors(currentPos, challenge.gridSize).filter(
      (n) => !obstacles.has(posKey(n))
    );

    let bestStep: Pos | null = null;
    let bestDist = Infinity;
    for (const n of validNeighbors) {
      const d = bfsDistance(n, nextTarget, challenge.gridSize, obstacles);
      if (d !== null && d < bestDist) {
        bestDist = d;
        bestStep = n;
      }
    }

    if (bestStep) {
      handleCellClick(bestStep.row, bestStep.col);
      setStatusMessage(`Hint moved you towards T${nextTarget.number}!`);
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const handleUndoStep = () => {
    if (playerPath.length > 1) {
      setPlayerPath((prev) => prev.slice(0, -1));
    }
  };

  const handleResetLevel = () => {
    if (challenge) {
      setPlayerPath([challenge.startPos]);
      setMistakesCount((prev) => prev + 1);
      setWarningMessage("Reset path to Start.");
      setTimeout(() => setWarningMessage(null), 1500);
    }
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Navigate from START (🚀) to connect targets in strict numerical order (T1 → T2 → TN).",
          "Move one adjacent cell at a time (cardinal directions).",
          "Avoid obstacle blocks (🪨) which cannot be traversed.",
          "Find an efficient route within the moves limit for maximum score.",
        ]}
        onStart={() => startNewGame(difficulty)}
        onBack={() => navigate("/app/cognitive-hub")}
      >
        <div className="mt-4 flex flex-col items-center gap-2">
          <label htmlFor="diff-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Difficulty
          </label>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === d
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      </GameInstructions>
    );
  }

  if (gameState === "results" && finalResult) {
    return (
      <GameResults
        result={finalResult}
        gameTitle={META.name}
        bestScore={bestScore}
        onReplay={() => startNewGame(difficulty)}
        onExit={() => navigate("/app/cognitive-hub")}
      />
    );
  }

  const gridSize = challenge?.gridSize || 5;
  const movesUsed = Math.max(0, playerPath.length - 1);

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
      maxTime={75}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-lg space-y-4 sm:space-y-5">
        {/* Status / Hint / Coins Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Level {totalRounds + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300">Completed: {correctCount}</span>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              onClick={handleHint}
              disabled={!nextTarget}
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-40"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{hintCost === 0 ? "Hint (Free)" : `Hint (${hintCost}🪙)`}</span>
            </button>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600 dark:text-cyan-400">🪙 {store.coins}</span>
          </div>
        </div>

        {statusMessage && (
          <div className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-xl animate-fade-in text-center w-full">
            {statusMessage}
          </div>
        )}

        {/* Objective & Sequence Status Banner */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 w-full shadow-sm text-center">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Targets Solved: {visitedCount} / {totalTargets}</span>
            <span>
              Moves: {movesUsed} / {challenge?.maxMoves} (Optimal: {challenge?.optimalMoves})
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-extrabold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              🚀 START
            </span>
            {sortedTargets.map((t) => {
              const isDone = t.number <= visitedCount;
              const isCurrentNext = t.number === visitedCount + 1;

              return (
                <React.Fragment key={t.number}>
                  <span className="text-slate-400 dark:text-slate-600">→</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      isDone
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 line-through opacity-80"
                        : isCurrentNext
                        ? "bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-400/40 animate-pulse shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isDone ? `✓ T${t.number}` : `🎯 T${t.number}`}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          {nextTarget && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <span>Next destination:</span>
              <span className="bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700">
                Target T{nextTarget.number} at (Row {nextTarget.row + 1}, Col {nextTarget.col + 1})
              </span>
            </div>
          )}

          {warningMessage && (
            <div className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Grid Map */}
        <div
          className="grid gap-2 sm:gap-2.5 w-full aspect-square p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {challenge?.grid.map((row, r) =>
            row.map((cell, c) => {
              const isStart = cell.type === "start";
              const isTarget = cell.type === "target";
              const isObstacle = cell.type === "obstacle";

              const pathIndex = playerPath.findIndex((p) => p.row === r && p.col === c);
              const isInPath = pathIndex !== -1;
              const isCurrentPos =
                currentPos && currentPos.row === r && currentPos.col === c;

              // Is this cell adjacent to current player position?
              const isAdjacent =
                currentPos &&
                !isObstacle &&
                Math.abs(currentPos.row - r) + Math.abs(currentPos.col - c) === 1;

              const isVisitedTarget = isTarget && (cell.targetNumber ?? 0) <= visitedCount;
              const isNextTarget = isTarget && cell.targetNumber === visitedCount + 1;

              let content: React.ReactNode = "";
              let cellStyle =
                "bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300";

              if (isObstacle) {
                content = (
                  <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-base sm:text-lg">🪨</span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-tighter opacity-80">BLOCK</span>
                  </div>
                );
                cellStyle =
                  "bg-slate-200/80 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-500 opacity-65 cursor-not-allowed pattern-diagonal";
              } else if (isCurrentPos) {
                content = (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-lg sm:text-xl">📍</span>
                    <span className="text-[9px] font-black uppercase text-white mt-0.5">YOU</span>
                  </div>
                );
                cellStyle =
                  "bg-indigo-600 border-2 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-500/20";
              } else if (isStart) {
                content = (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-base sm:text-lg">🚀</span>
                    <span className="text-[9px] font-black uppercase text-emerald-800 dark:text-emerald-300 mt-0.5">START</span>
                  </div>
                );
                cellStyle =
                  "bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm";
              } else if (isTarget) {
                content = (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-sm sm:text-base">{isVisitedTarget ? "✓" : "🎯"}</span>
                    <span className="text-[10px] sm:text-xs font-black mt-0.5">
                      T{cell.targetNumber}
                    </span>
                  </div>
                );
                if (isVisitedTarget) {
                  cellStyle =
                    "bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-80";
                } else if (isNextTarget) {
                  cellStyle =
                    "bg-amber-400 border-2 border-amber-600 text-slate-950 shadow-md ring-4 ring-amber-400/30 font-black animate-pulse";
                } else {
                  cellStyle =
                    "bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/70 text-amber-900 dark:text-amber-200";
                }
              } else if (isInPath) {
                content = (
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400">
                    #{pathIndex}
                  </span>
                );
                cellStyle =
                  "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300";
              }

              if (isAdjacent && !isCurrentPos) {
                cellStyle += " ring-2 ring-teal-500/40 border-teal-500 cursor-pointer hover:scale-102 transition-transform";
              }

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  disabled={isObstacle}
                  aria-label={`Grid cell row ${r + 1} col ${c + 1} ${cell.type}`}
                  className={`w-full h-full rounded-2xl border flex items-center justify-center font-bold transition-all duration-150 active:scale-95 ${cellStyle} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>

        {/* Level Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <button
            type="button"
            onClick={handleUndoStep}
            disabled={playerPath.length <= 1}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo Step</span>
          </button>

          <button
            type="button"
            onClick={handleResetLevel}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Path</span>
          </button>

          <button
            type="button"
            onClick={finishGame}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95 transition-all shadow-sm"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Route</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
