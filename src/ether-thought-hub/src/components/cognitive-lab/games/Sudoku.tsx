import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RotateCcw,
  Sparkles,
  Eraser,
  Pencil,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { GameShell } from "../GameShell";
import { GameInstructions } from "../GameInstructions";
import { GameResults } from "../GameResults";
import { FeedbackOverlay } from "../FeedbackEffects";
import {
  generateSudokuChallenge,
  getSudokuConflicts,
  isSudokuComplete,
  getSudokuHint,
  resetSudokuGrid,
  type SudokuChallenge,
  type SudokuGrid,
} from "../../../lib/cognitive-lab/engines/sudoku";
import { GAME_META, DIFFICULTY_LABELS } from "../../../lib/cognitive-lab/constants";
import { useCognitiveLabStore } from "../../../stores/cognitive-lab-store";
import type { DifficultyLevel, GameResult } from "../../../lib/cognitive-lab/types";

const META = GAME_META["sudoku"];

export function SudokuGame() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"instructions" | "playing" | "results">("instructions");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(3);
  const [challenge, setChallenge] = useState<SudokuChallenge | null>(null);
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(360); // 6 mins default
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);

  const store = useCognitiveLabStore();
  const bestScore = store.getBestScore("sudoku");
  const hintCost = store.getHintCost();

  const startNewGame = useCallback((diff: DifficultyLevel = 3) => {
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    setMistakes(0);
    setHintsUsed(0);
    setTimeLeft(360);
    setIsPaused(false);
    setSelectedCell(null);
    setIsNotesMode(false);
    setStatusMessage(null);

    const newChallenge = generateSudokuChallenge(diff);
    setChallenge(newChallenge);
    // Deep clone initial grid for player modifications
    const playerGrid = newChallenge.initialGrid.map((row) =>
      row.map((cell) => ({ ...cell, notes: [] }))
    );
    setGrid(playerGrid);
    setGameState("playing");
  }, []);

  const finishGame = useCallback(
    (isWon: boolean) => {
      const durationMs = (360 - timeLeft) * 1000;
      
      // Normalized score percentage 0-100
      let scorePercentage = 0;
      if (isWon) {
        scorePercentage = Math.max(60, Math.min(100, Math.round(100 - (mistakes * 5) - (hintsUsed * 8))));
      } else {
        // Calculate partially correct filled cells
        let correctCount = 0;
        if (challenge) {
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (grid[r]?.[c]?.value === challenge.solution[r]?.[c]) {
                correctCount++;
              }
            }
          }
        }
        scorePercentage = Math.min(55, Math.round((correctCount / 81) * 50));
      }

      const attemptId = `sudoku_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const coinsEarned = store.claimReward(attemptId, scorePercentage, difficulty);
      const totalScore = Math.round(scorePercentage * 10 * difficulty);

      const result: GameResult = {
        id: attemptId,
        gameId: "sudoku",
        playedAt: Date.now(),
        difficulty,
        totalRounds: 1,
        correctRounds: isWon ? 1 : 0,
        score: totalScore,
        scorePercentage,
        isSuccess: scorePercentage >= 60,
        coinsEarned,
        hintsUsed,
        mistakes,
        accuracy: scorePercentage,
        avgResponseTimeMs: Math.round(durationMs / 40),
        maxStreak: isWon ? 1 : 0,
        durationMs,
        rounds: [
          {
            roundIndex: 1,
            correct: isWon,
            responseTimeMs: durationMs,
            score: totalScore,
          },
        ],
      };

      store.recordResult(result);
      setFinalResult(result);
      setGameState("results");
    },
    [challenge, difficulty, grid, hintsUsed, mistakes, store, timeLeft]
  );

  // Timer loop
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused, finishGame]);

  // Handle number input for selected cell
  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || !challenge) return;
      const { r, c } = selectedCell;
      const cell = grid[r]?.[c];
      if (!cell || cell.given) return;

      if (isNotesMode) {
        // Toggle note
        const currentNotes = cell.notes || [];
        const newNotes = currentNotes.includes(num)
          ? currentNotes.filter((n) => n !== num)
          : [...currentNotes, num].sort();

        setGrid((prev) =>
          prev.map((row, ri) =>
            row.map((cell, ci) => (ri === r && ci === c ? { ...cell, notes: newNotes } : cell))
          )
        );
        return;
      }

      // Enter number without penalizing or blocking on row/col/box conflicts
      const updatedGrid = grid.map((row, ri) =>
        row.map((cell, ci) =>
          ri === r && ci === c ? { ...cell, value: num, notes: [] } : cell
        )
      );
      setGrid(updatedGrid);

      // Check if puzzle is fully solved and correct according to solution
      if (isSudokuComplete(updatedGrid, challenge.solution)) {
        setFeedback("correct");
        setTimeout(() => {
          setFeedback(null);
          finishGame(true);
        }, 600);
      }
    },
    [selectedCell, challenge, grid, isNotesMode, finishGame]
  );

  const handleEraseCell = useCallback(() => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const cell = grid[r]?.[c];
    if (!cell || cell.given) return;

    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? { ...cell, value: null, notes: [] } : cell))
      )
    );
  }, [selectedCell, grid]);

  // Reset Grid to initial clues
  const handleResetGrid = useCallback(() => {
    if (!challenge) return;
    setGrid(resetSudokuGrid(challenge.initialGrid));
    setSelectedCell(null);
    setStatusMessage("Grid reset to initial clues.");
    setTimeout(() => setStatusMessage(null), 1800);
  }, [challenge]);

  // Request a hint with universal coin checking
  const handleHint = () => {
    if (!challenge) return;
    const hint = getSudokuHint(grid, challenge.solution);
    if (!hint) {
      setStatusMessage("Puzzle is already completely and correctly filled!");
      setTimeout(() => setStatusMessage(null), 2000);
      return;
    }

    const req = store.requestHint();
    if (!req.success) {
      setStatusMessage(req.error || "Not enough coins for this hint.");
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    setHintsUsed((h) => h + 1);
    setSelectedCell({ r: hint.row, c: hint.col });
    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) =>
          ri === hint.row && ci === hint.col
            ? { ...cell, value: hint.value, notes: [] }
            : cell
        )
      )
    );
    setStatusMessage(`Hint revealed: ${hint.value} at Row ${hint.row + 1}, Col ${hint.col + 1}`);
    setTimeout(() => setStatusMessage(null), 2200);

    // Check completion after hint
    const testGrid = grid.map((row, ri) =>
      row.map((cell, ci) =>
        ri === hint.row && ci === hint.col ? { ...cell, value: hint.value } : cell
      )
    );
    if (isSudokuComplete(testGrid, challenge.solution)) {
      setFeedback("correct");
      setTimeout(() => finishGame(true), 600);
    }
  };

  // Keyboard navigation & number typing
  useEffect(() => {
    if (gameState !== "playing" || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-9
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        handleNumberInput(parseInt(e.key, 10));
        return;
      }

      // Backspace or Delete
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleEraseCell();
        return;
      }

      // Arrow navigation
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setSelectedCell((prev) => {
          if (!prev) return { r: 0, c: 0 };
          let { r, c } = prev;
          if (e.key === "ArrowUp") r = Math.max(0, r - 1);
          if (e.key === "ArrowDown") r = Math.min(8, r + 1);
          if (e.key === "ArrowLeft") c = Math.max(0, c - 1);
          if (e.key === "ArrowRight") c = Math.min(8, c + 1);
          return { r, c };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, isPaused, handleNumberInput, handleEraseCell]);

  if (gameState === "instructions") {
    return (
      <GameInstructions
        gameName={META.name}
        icon={META.icon}
        instructions={[
          "Fill every row, column, and 3×3 square with numbers 1 through 9.",
          "Each number must appear exactly once per row, column, and 3×3 block.",
          "Initial puzzle clues cannot be changed.",
          "Real-time duplicate conflicts in any row, column, or 3×3 block are clearly highlighted in RED.",
          "Toggle 'Notes Mode' to jot down candidate possibilities in any cell.",
          "Puzzle auto-completes the moment the grid matches the valid solution!",
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
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

  const conflicts = getSudokuConflicts(grid);
  const selectedCellValue = selectedCell ? grid[selectedCell.r]?.[selectedCell.c]?.value : null;

  return (
    <GameShell
      title={META.name}
      categoryName={META.categoryLabel}
      categoryIcon={META.icon}
      difficulty={difficulty}
      score={score}
      streak={streak}
      timeLeft={timeLeft}
      maxTime={360}
      isPaused={isPaused}
      onPauseToggle={() => setIsPaused(!isPaused)}
      onRestart={() => startNewGame(difficulty)}
      onBack={() => navigate("/app/cognitive-hub")}
    >
      <FeedbackOverlay feedback={feedback} />

      <div className="w-full flex flex-col items-center max-w-lg space-y-4">
        {/* Status Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-4 w-full flex items-center justify-between text-xs font-bold shadow-sm">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Difficulty: {DIFFICULTY_LABELS[difficulty]}
          </span>
          <div className="flex items-center gap-3">
            <span className={mistakes > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}>
              Mistakes: {mistakes}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-600 dark:text-amber-400">Hints: {hintsUsed}</span>
            <span className="text-slate-400">•</span>
            <span className="text-indigo-600 dark:text-cyan-400">🪙 {store.coins}</span>
          </div>
        </div>

        {/* Real-time Conflict Alert Banner */}
        {conflicts.size > 0 && (
          <div className="w-full text-xs font-extrabold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 animate-pulse shadow-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>Conflict Alert: Duplicate number in row, column, or 3×3 box!</span>
          </div>
        )}

        {statusMessage && (
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl animate-fade-in flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 9x9 Sudoku Board */}
        <div className="w-full aspect-square max-w-[440px] bg-slate-900 dark:bg-slate-950 p-2 sm:p-2.5 rounded-3xl shadow-xl border-4 border-slate-800 dark:border-slate-800">
          <div className="grid grid-cols-9 h-full w-full gap-[1px] bg-slate-300 dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-400 dark:border-slate-600">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isSameNumber = selectedCellValue !== null && cell.value === selectedCellValue;
                const isConflict = conflicts.has(`${r},${c}`) || conflicts.has(`${r}-${c}`);
                const isSameRowOrCol =
                  selectedCell && (selectedCell.r === r || selectedCell.c === c);

                // Subgrid borders (every 3rd row/column gets thicker boundary)
                const isRightSubgrid = (c + 1) % 3 === 0 && c !== 8;
                const isBottomSubgrid = (r + 1) % 3 === 0 && r !== 8;

                let cellBg = "bg-white dark:bg-slate-900";
                if (isSelected) {
                  cellBg = isConflict
                    ? "bg-rose-600 text-white font-black ring-4 ring-rose-400 z-20"
                    : "bg-blue-600 text-white font-black ring-2 ring-blue-400 z-10";
                } else if (isConflict) {
                  cellBg = "bg-rose-100 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-400 dark:border-rose-700 shadow-inner";
                } else if (isSameNumber) {
                  cellBg = "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold";
                } else if (isSameRowOrCol) {
                  cellBg = "bg-slate-50 dark:bg-slate-850";
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => setSelectedCell({ r, c })}
                    aria-label={`Cell Row ${r + 1} Col ${c + 1}`}
                    className={`relative flex items-center justify-center text-base sm:text-lg font-mono transition-colors duration-75 focus:outline-none ${cellBg} ${
                      cell.given ? "font-black text-slate-950 dark:text-slate-100" : "font-semibold text-blue-600 dark:text-cyan-400"
                    } ${isRightSubgrid ? "border-r-2 border-r-slate-800 dark:border-r-slate-500" : ""} ${
                      isBottomSubgrid ? "border-b-2 border-b-slate-800 dark:border-b-slate-500" : ""
                    }`}
                  >
                    {cell.value ? (
                      cell.value
                    ) : cell.notes && cell.notes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5 text-[8px] sm:text-[9px] font-mono text-slate-400 dark:text-slate-500 leading-none">
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                          <span key={n} className="flex items-center justify-center">
                            {cell.notes?.includes(n) ? n : ""}
                          </span>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Action Controls & Number Pad */}
        <div className="w-full max-w-[440px] space-y-3">
          {/* Action Row: Erase, Notes, Reset Grid, Hint */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleEraseCell}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 shadow-sm transition-all"
            >
              <Eraser className="w-4 h-4" />
              <span>Erase</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotesMode(!isNotesMode)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold active:scale-95 shadow-sm transition-all ${
                isNotesMode
                  ? "bg-amber-400 border-amber-500 text-slate-950 shadow-amber-400/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>Notes {isNotesMode ? "ON" : "OFF"}</span>
            </button>

            <button
              type="button"
              onClick={handleResetGrid}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleHint}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 shadow-sm transition-all"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{hintCost === 0 ? "Hint (Free)" : `Hint (${hintCost}🪙)`}</span>
            </button>
          </div>

          {/* Virtual Digits Pad (1–9) */}
          <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberInput(num)}
                className="py-3 sm:py-3.5 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black text-lg sm:text-xl font-mono shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
}
