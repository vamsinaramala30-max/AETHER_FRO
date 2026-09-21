import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Flag } from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generatePatternShiftChallenge,
  validatePatternShiftAnswer,
  type PatternShiftChallenge,
  type PatternItem,
} from "../../../lib/cognitive-lab/engines/pattern-shift";
import { calcRoundScore } from "../../../lib/cognitive-lab/scoring";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";
import { ShapeIcon } from "../../../../../cognitive-hub/components/gameVisuals";

const META = GAME_META["pattern-shift"];

export function PatternShiftGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<PatternShiftChallenge | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("pattern-shift");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setHintsUsed(0);
    setTimeLeft(45);
    setIsPaused(false);
    setEliminatedIndices([]);
    setStatusMessage(null);
    const initialChallenge = generatePatternShiftChallenge(diff);
    setChallenge(initialChallenge);
    setGameState("playing");
  }, []);

  const finishGame = useCallback(() => {
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
    const scorePercentage = accuracy;
    const durationMs = (45 - timeLeft) * 1000;
    const attemptId = `patternshift_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);

    const result: GameResult = {
      id: attemptId,
      gameId: "pattern-shift",
      playedAt: Date.now(),
      difficulty,
      totalRounds,
      correctRounds: correctCount,
      score,
      scorePercentage,
      isSuccess: scorePercentage >= 60,
      coinsEarned,
      hintsUsed,
      accuracy,
      avgResponseTimeMs: 600,
      maxStreak,
      durationMs,
      rounds: [],
    };

    store.recordResult(result);
    setFinalResult(result);
    setGameState("results");
  }, [totalRounds, correctCount, score, timeLeft, maxStreak, difficulty, hintsUsed, store]);

  // Timer loop
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

  const handleSelectOption = (item: PatternItem) => {
    if (!challenge) return;
    const isCorrect = validatePatternShiftAnswer(challenge, item);
    setTotalRounds((prev) => prev + 1);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      const roundPts = calcRoundScore({
        correct: true,
        responseTimeMs: 500,
        difficulty,
        streak: newStreak,
      });
      setScore((prev) => prev + roundPts);
      setFeedback("correct");
    } else {
      setStreak(0);
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback(null);
      setEliminatedIndices([]);
      setChallenge(generatePatternShiftChallenge(difficulty));
    }, 450);
  };

  const handleHint = () => {
    if (!challenge) return;
    const wrongIndices = challenge.options
      .map((opt, idx) => ({ opt, idx }))
      .filter(({ opt, idx }) => !validatePatternShiftAnswer(challenge, opt) && !eliminatedIndices.includes(idx));

    if (wrongIndices.length === 0) {
      setStatusMessage("Only the correct sequence element remains!");
      setTimeout(() => setStatusMessage(null), 1800);
      return;
    }

    const req = store.requestHint();
    if (!req.success) {
      setStatusMessage(req.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    setHintsUsed((h) => h + 1);
    const targetIdx = wrongIndices[0]!.idx;
    setEliminatedIndices((prev) => [...prev, targetIdx]);
    setStatusMessage(`Hint: Option #${targetIdx + 1} eliminated!`);
    setTimeout(() => setStatusMessage(null), 2000);
  };

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Observe the progression of shapes, colors, or sizes.",
          "Deduce the underlying sequential pattern rule.",
          "Select the option that logically completes the sequence.",
          "Score 60% accuracy or higher to earn rewards!",
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
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
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

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
      maxTime={45}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-xl space-y-5">
        {/* Status Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Round {totalRounds + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300">Correct: {correctCount}/{totalRounds}</span>
            <span className="text-slate-400">•</span>
            <button
              type="button"
              onClick={handleHint}
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
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

        {/* Pattern Rule description */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center w-full shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
            Pattern Rule
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{challenge?.rule}</p>
        </div>

        {/* Sequence Display */}
        <div className="flex items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl w-full shadow-sm overflow-x-auto">
          {challenge?.sequence.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-sm relative"
              title={`${item.size} ${item.color} ${item.shape}`}
            >
              <ShapeIcon shape={item.shape} color={item.color} size={item.size} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1 select-none">
                {item.size}
              </span>
            </div>
          ))}

          <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-400 dark:border-indigo-600 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 shadow-sm">
            ?
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
          {challenge?.options.map((option, idx) => {
            const isEliminated = eliminatedIndices.includes(idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isEliminated}
                className={`p-4 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                  isEliminated
                    ? "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40 line-through cursor-not-allowed"
                    : "bg-white dark:bg-slate-800/90 hover:bg-indigo-50/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 active:scale-95"
                }`}
                aria-label={`Option ${idx + 1}: ${option.size} ${option.color} ${option.shape}`}
                title={`${option.size} ${option.color} ${option.shape}`}
              >
                <ShapeIcon shape={option.shape} color={option.color} size={option.size} />
                <span className="text-xs font-bold capitalize text-slate-700 dark:text-slate-300">
                  {option.color} ({option.size.toUpperCase()})
                </span>
              </button>
            );
          })}
        </div>

        {/* Finish Module Action */}
        <div className="w-full pt-1">
          <button
            type="button"
            onClick={finishGame}
            disabled={totalRounds === 0}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Flag className="w-4 h-4" />
            <span>Finish Pattern Module &amp; View Result</span>
          </button>
        </div>
      </div>
    </GameShell>
  );
}
