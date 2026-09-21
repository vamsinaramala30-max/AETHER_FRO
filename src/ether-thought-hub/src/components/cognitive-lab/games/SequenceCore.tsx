import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, RotateCcw, Undo2, Play, Eye, Lightbulb, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateSequenceCoreChallenge,
  validateSequenceCoreAnswer,
  type SequenceCoreChallenge,
  type SequenceTile,
} from "../../../lib/cognitive-lab/engines/sequence-core";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult, RoundResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["sequence-core"];

export function SequenceCoreGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "display" | "recall" | "results">(
    "instructions"
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<SequenceCoreChallenge | null>(null);
  const [userSequenceIds, setUserSequenceIds] = useState<number[]>([]);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);
  const [roundsHistory, setRoundsHistory] = useState<RoundResult[]>([]);

  const recallStartRef = useRef<number>(0);
  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("sequence-core");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setTimeLeft(50);
    setIsPaused(false);
    setUserSequenceIds([]);
    setIsSubmitting(false);
    setHintsUsed(0);
    setStatusMessage(null);
    setRoundsHistory([]);
    const initialChallenge = generateSequenceCoreChallenge(diff);
    setChallenge(initialChallenge);
    setGameState("display");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (50 - timeLeft) * 1000;
    const attemptId = `seqcore_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const avgResponseTimeMs =
      roundsHistory.length > 0
        ? Math.round(
            roundsHistory.reduce((sum, r) => sum + r.responseTimeMs, 0) / roundsHistory.length
          )
        : 600;

    const result: GameResult = {
      id: attemptId,
      gameId: "sequence-core",
      playedAt: Date.now(),
      difficulty,
      totalRounds,
      correctRounds: correctCount,
      score,
      scorePercentage,
      isSuccess: scorePercentage >= 60,
      coinsEarned,
      hintsUsed,
      mistakes: totalRounds - correctCount,
      accuracy,
      avgResponseTimeMs,
      maxStreak,
      durationMs,
      rounds: roundsHistory,
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, score, timeLeft, maxStreak, difficulty, hintsUsed, roundsHistory, store]);

  // Playback during display phase
  useEffect(() => {
    if (gameState !== "display" || !challenge) return;

    let index = 0;
    setActiveDisplayIndex(0);

    const interval = setInterval(() => {
      index += 1;
      if (index >= challenge.sequence.length) {
        clearInterval(interval);
        setActiveDisplayIndex(null);
        setGameState("recall");
        recallStartRef.current = performance.now();
      } else {
        setActiveDisplayIndex(index);
      }
    }, challenge.showDurationMs);

    return () => clearInterval(interval);
  }, [gameState, challenge]);

  // Timer loop
  useEffect(() => {
    if ((gameState !== "display" && gameState !== "recall") || isPaused) return;

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

  const handleTileClick = (tile: SequenceTile) => {
    if (gameState !== "recall" || !challenge || isSubmitting) return;
    if (userSequenceIds.length >= challenge.sequence.length) return;

    setUserSequenceIds((prev) => [...prev, tile.id]);
  };

  const handleUndo = () => {
    if (gameState !== "recall" || isSubmitting) return;
    setUserSequenceIds((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (gameState !== "recall" || isSubmitting) return;
    setUserSequenceIds([]);
  };

  const handleHint = () => {
    if (gameState !== "recall" || !challenge) return;
    if (userSequenceIds.length >= challenge.sequence.length) return;

    const res = store.requestHint();
    if (!res.success) {
      setStatusMessage(res.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setHintsUsed((prev) => prev + 1);
    const nextIdx = userSequenceIds.length;
    const nextTile = challenge.sequence[nextIdx];
    if (nextTile) {
      setUserSequenceIds((prev) => [...prev, nextTile.id]);
      setStatusMessage(`Hint: Added next item "${nextTile.label}"`);
      setTimeout(() => setStatusMessage(null), 2000);
    }
  };

  const handleSubmit = () => {
    if (gameState !== "recall" || !challenge || isSubmitting) return;
    if (userSequenceIds.length !== challenge.sequence.length) return;

    setIsSubmitting(true);
    const responseTimeMs = Math.round(performance.now() - recallStartRef.current);
    const isCorrect = validateSequenceCoreAnswer(challenge, userSequenceIds);
    const roundIdx = totalRounds + 1;

    setTotalRounds(roundIdx);

    let roundPoints = 0;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      roundPoints = calcRoundScore({
        correct: true,
        responseTimeMs,
        difficulty,
        streak: newStreak,
      });
      setScore((prev) => prev + roundPoints);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("incorrect");
    }

    setRoundsHistory((prev) => [
      ...prev,
      {
        roundIndex: roundIdx,
        correct: isCorrect,
        responseTimeMs,
        score: roundPoints,
      },
    ]);

    setTimeout(() => {
      setFeedback(null);
      setUserSequenceIds([]);
      setIsSubmitting(false);
      setChallenge(generateSequenceCoreChallenge(difficulty));
      setGameState("display");
    }, 700);
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Observe the tiles flashing one by one in sequence.",
          "Remember the exact order, symbols, and colors.",
          "Tap the tiles to recreate the sequence in order.",
          "Use 'Undo' to fix mistakes, or 'Hint' if stuck, then press 'SUBMIT SEQUENCE'.",
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
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
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

  const expectedLength = challenge?.sequence.length ?? 0;
  const isComplete = userSequenceIds.length === expectedLength;

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
      maxTime={50}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-xl space-y-4 sm:space-y-6">
        {/* Status / Hint / Coins Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Round {totalRounds + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300">Solved: {correctCount}/{totalRounds}</span>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              onClick={handleHint}
              disabled={gameState !== "recall"}
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
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl animate-fade-in text-center w-full">
            {statusMessage}
          </div>
        )}

        {/* Pattern Description Banner */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-center w-full shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              {challenge?.patternDescription}
            </span>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400">
              Length: {expectedLength} items
            </span>
          </div>

          {gameState === "display" ? (
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-base sm:text-lg">
              <Eye className="w-5 h-5 animate-pulse" />
              <span>Observe and memorize the sequence!</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">
                Recall and select the exact sequence:
              </p>
              <span className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full ${
                isComplete
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
              }`}>
                {userSequenceIds.length} / {expectedLength}
              </span>
            </div>
          )}
        </div>

        {/* Display / Slots Area */}
        <div className="min-h-[140px] w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 shadow-sm">
          {gameState === "display" && activeDisplayIndex !== null && challenge ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-xl ${
                  challenge.sequence[activeDisplayIndex]?.color
                } transition-all duration-150 transform scale-105 drop-shadow-md`}
              >
                {challenge.sequence[activeDisplayIndex]?.label}
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">
                Item {activeDisplayIndex + 1} of {challenge.sequence.length}
              </span>
            </div>
          ) : gameState === "recall" && challenge ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {Array.from({ length: expectedLength }).map((_, slotIdx) => {
                  const selectedId = userSequenceIds[slotIdx];
                  const tile = selectedId !== undefined
                    ? challenge.tiles.find((t) => t.id === selectedId) || challenge.sequence.find((t) => t.id === selectedId)
                    : null;

                  return (
                    <div
                      key={slotIdx}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all ${
                        tile
                          ? `${tile.color} text-white shadow-md transform scale-100`
                          : "border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600"
                      }`}
                    >
                      {tile ? (
                        <>
                          <span>{tile.label}</span>
                          <span className="text-[10px] font-mono opacity-75 leading-none">#{slotIdx + 1}</span>
                        </>
                      ) : (
                        <span className="text-xs font-mono font-normal">{slotIdx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {userSequenceIds.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Tap the tiles below in the recorded order, then press Submit.
                </p>
              )}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-600 font-semibold text-sm">Preparing sequence...</span>
          )}
        </div>

        {/* Input Tile Palette */}
        {gameState === "recall" && challenge && (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 w-full">
              {challenge.tiles.map((tile) => {
                const timesSelected = userSequenceIds.filter((id) => id === tile.id).length;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(tile)}
                    disabled={isSubmitting || userSequenceIds.length >= expectedLength}
                    aria-label={`Select tile ${tile.label}`}
                    className={`relative py-4 sm:py-5 rounded-2xl ${tile.color} hover:brightness-110 active:scale-95 text-white font-black text-xl sm:text-2xl transition-all duration-150 shadow-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/20`}
                  >
                    {tile.label}
                    {timesSelected > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                        {timesSelected}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Bar: Undo, Clear, Finish Training, SUBMIT */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full pt-1">
              <button
                type="button"
                onClick={handleUndo}
                disabled={userSequenceIds.length === 0 || isSubmitting}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Undo2 className="w-4 h-4" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={userSequenceIds.length === 0 || isSubmitting}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={finishGame}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95 transition-all shadow-sm"
              >
                <Flag className="w-4 h-4" />
                <span>Finish Training</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isComplete || isSubmitting}
                className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-sm sm:text-base font-extrabold transition-all duration-150 shadow-md active:scale-98 ${
                  isComplete && !isSubmitting
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-2 ring-indigo-500/20"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>SUBMIT SEQUENCE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
