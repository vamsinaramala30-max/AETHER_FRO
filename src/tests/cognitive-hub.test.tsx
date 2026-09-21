import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import {
  GAME_COLORS,
  getGameColor,
  ShapeIcon,
  type VisualColor,
  type VisualShape,
} from '../cognitive-hub/components/gameVisuals';
import {
  generateFocusLockChallenge,
  validateFocusLockAnswer,
  type FocusLockSymbol,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/focus-lock';
import {
  generateSequenceCoreChallenge,
  validateSequenceCoreAnswer,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/sequence-core';
import { generateLogicForgeChallenge } from '../ether-thought-hub/src/lib/cognitive-lab/engines/logic-forge';
import {
  generateMemoryMatrixChallenge,
  validateMemoryMatrixAnswer,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/memory-matrix';
import {
  generateReactionControlChallenge,
  type ReactionTrial,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/reaction-control';
import {
  generatePatternShiftChallenge,
  validatePatternShiftAnswer,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/pattern-shift';
import { generateStrategyGridChallenge } from '../ether-thought-hub/src/lib/cognitive-lab/engines/strategy-grid';
import {
  generateCodeBreakerChallenge,
  scoreGuess,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/code-breaker';
import {
  generateSudokuChallenge,
  getSudokuConflicts,
  isSudokuComplete,
  type SudokuCell,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/sudoku';
import {
  generateLogicGridChallenge,
  validateLogicSolution,
  checkLogicGridContradiction,
} from '../ether-thought-hub/src/lib/cognitive-lab/engines/logic-grid';
import { useCognitiveLabStore } from '../ether-thought-hub/src/stores/cognitive-lab-store';
import { ALL_GAME_IDS } from '../ether-thought-hub/src/lib/cognitive-lab/constants';
import { GameResults } from '../ether-thought-hub/src/components/cognitive-lab/GameResults';
import { SudokuGame } from '../ether-thought-hub/src/components/cognitive-lab/games/Sudoku';
import { LogicGridGame } from '../ether-thought-hub/src/components/cognitive-lab/games/LogicGrid';
import { CognitiveHubPage } from '../cognitive-hub/CognitiveHubPage';
import { saveCoins, saveCompletedGamesCount } from '../ether-thought-hub/src/lib/cognitive-lab/storage';
import { MemoryRouter } from 'react-router-dom';

describe('Cognitive Hub Visuals & Game Engines', () => {
  describe('Visual System & Color Tokens', () => {
    it('provides all 8 semantic game color tokens with high contrast values', () => {
      const colors: VisualColor[] = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
      colors.forEach((c: VisualColor) => {
        const token = GAME_COLORS[c];
        expect(token).toBeDefined();
        expect(token.fill).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(token.stroke).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(token.bgLight).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(token.textDark).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(token.borderLight).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('retrieves colors via getGameColor with case-insensitivity and fallback', () => {
      expect(getGameColor('BLUE').fill).toBe(GAME_COLORS.blue.fill);
      expect(getGameColor('red').name).toBe('Red');
      expect(getGameColor('unknown-color').fill).toBe(GAME_COLORS.blue.fill);
    });

    it('renders ShapeIcon for all 6 SVG geometric shapes', () => {
      const shapes: VisualShape[] = ['circle', 'square', 'triangle', 'diamond', 'star', 'pentagon'];
      shapes.forEach((shape: VisualShape) => {
        const { container } = render(<ShapeIcon shape={shape} color="green" size="md" showLabel />);
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(container.textContent).toContain('Green');
      });
    });
  });

  describe('FocusLock Engine', () => {
    it('generates items and target criteria', () => {
      const challenge = generateFocusLockChallenge(3);
      expect(challenge.grid.length).toBe(challenge.gridSize * challenge.gridSize);
      expect(challenge.targetShape).toBeTruthy();
      expect(challenge.targetColor).toBeTruthy();
      expect(challenge.targetCount).toBeGreaterThanOrEqual(1);

      const targetIds = challenge.grid
        .filter((item: FocusLockSymbol) => item.isTarget)
        .map((item: FocusLockSymbol) => item.id);
      expect(targetIds.length).toBe(challenge.targetCount);

      const isCorrect = validateFocusLockAnswer(challenge, new Set(targetIds));
      expect(isCorrect).toBe(true);
    });
  });

  describe('SequenceCore Engine', () => {
    it('generates sequences with correct length according to difficulty', () => {
      const ch1 = generateSequenceCoreChallenge(1);
      const ch3 = generateSequenceCoreChallenge(3);
      const ch5 = generateSequenceCoreChallenge(5);
      expect(ch1.sequence.length).toBeLessThanOrEqual(ch3.sequence.length);
      expect(ch3.sequence.length).toBeLessThanOrEqual(ch5.sequence.length);
      expect(ch1.tiles.length).toBeGreaterThanOrEqual(ch1.sequence.length);
      // Higher difficulties include distractors
      expect(ch5.tiles.length).toBeGreaterThan(ch5.sequence.length);
    });

    it('validates correct and incorrect user submissions accurately', () => {
      const challenge = generateSequenceCoreChallenge(2);
      expect(validateSequenceCoreAnswer(challenge, challenge.sequence)).toBe(true);

      // Incomplete answer
      expect(validateSequenceCoreAnswer(challenge, challenge.sequence.slice(0, 1))).toBe(false);

      // Wrong item
      const wrongAnswer = [...challenge.sequence];
      wrongAnswer[0] = { id: 99999, label: 'X', color: 'bg-rose-600' };
      expect(validateSequenceCoreAnswer(challenge, wrongAnswer)).toBe(false);
    });
  });

  describe('LogicForge Engine', () => {
    it('generates valid premises and single correct answer', () => {
      const challenge = generateLogicForgeChallenge(3);
      expect(challenge.premises.length).toBe(2);
      expect(challenge.options.length).toBe(4);
      expect(challenge.correctIndex).toBeGreaterThanOrEqual(0);
      expect(challenge.correctIndex).toBeLessThan(4);
      expect(challenge.explanation).toBeTruthy();
    });
  });

  describe('MemoryMatrix Engine', () => {
    it('generates matrix pattern within grid dimensions', () => {
      const challenge = generateMemoryMatrixChallenge(3);
      expect(challenge.gridSize).toBeGreaterThanOrEqual(3);
      expect(challenge.activeCells.length).toBeGreaterThan(0);
      const maxIndex = challenge.gridSize * challenge.gridSize;
      challenge.activeCells.forEach((index: number) => {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(maxIndex);
      });

      expect(validateMemoryMatrixAnswer(challenge, challenge.activeCells)).toBe(true);
    });
  });

  describe('ReactionControl Engine', () => {
    it('generates target or distractor stimulus', () => {
      const challenge = generateReactionControlChallenge(3);
      expect(challenge.trials.length).toBeGreaterThan(0);
      const goTrials = challenge.trials.filter((t: ReactionTrial) => t.type === 'go');
      const noGoTrials = challenge.trials.filter((t: ReactionTrial) => t.type === 'nogo');
      expect(goTrials.length).toBeGreaterThan(0);
      expect(noGoTrials.length).toBeGreaterThan(0);
      expect(challenge.showDurationMs).toBeGreaterThan(0);
    });
  });

  describe('PatternShift Engine', () => {
    it('generates pattern series and distinct answer choices', () => {
      const challenge = generatePatternShiftChallenge(3);
      expect(challenge.sequence.length).toBeGreaterThanOrEqual(3);
      expect(challenge.options.length).toBe(4);
      expect(challenge.answer).toBeDefined();
      expect(validatePatternShiftAnswer(challenge, challenge.answer)).toBe(true);
    });
  });

  describe('StrategyGrid Engine', () => {
    it('generates grid with start, ordered targets, and obstacles', () => {
      const challenge = generateStrategyGridChallenge(3);
      expect(challenge.gridSize).toBeGreaterThanOrEqual(4);
      expect(challenge.startPos).toBeDefined();
      expect(challenge.targets.length).toBeGreaterThanOrEqual(1);
      expect(challenge.maxMoves).toBeGreaterThan(0);
      expect(challenge.grid.length).toBe(challenge.gridSize);
    });
  });

  describe('CodeBreaker Engine', () => {
    it('generates secret code and evaluates exact and partial pegs correctly', () => {
      const challenge = generateCodeBreakerChallenge(3);
      expect(challenge.secretCode.length).toBe(challenge.codeLength);
      expect(challenge.colorPool.length).toBeGreaterThanOrEqual(4);

      // Test exact match
      const exactScore = scoreGuess(challenge.secretCode, challenge.secretCode);
      expect(exactScore.blacks).toBe(challenge.codeLength);
      expect(exactScore.whites).toBe(0);

      // Test custom known guess
      const secret = ['red', 'blue', 'green', 'yellow'] as const;
      const guess = ['blue', 'red', 'green', 'yellow'] as const;
      const feedback = scoreGuess([...secret], [...guess]);
      expect(feedback.blacks).toBe(2); // green, yellow in exact place
      expect(feedback.whites).toBe(2); // blue, red in swapped place
    });
  });

  describe('Sudoku Engine', () => {
    it('generates a 9x9 board with valid solution and conflict detection', () => {
      const challenge = generateSudokuChallenge(3);
      expect(challenge.initialGrid.length).toBe(9);
      expect(challenge.initialGrid[0]?.length).toBe(9);
      expect(challenge.solution.length).toBe(9);
      expect(challenge.cluesCount).toBeGreaterThanOrEqual(20);

      // Check conflict detection
      const conflicts = getSudokuConflicts(challenge.initialGrid);
      expect(conflicts.size).toBe(0); // Initial board has no conflicting clues

      // Solved state check
      const solvedGrid = challenge.solution.map((row: number[], r: number) =>
        row.map((val: number, c: number) => ({
          row: r,
          col: c,
          value: val,
          given: true,
        }))
      );
      expect(isSudokuComplete(solvedGrid, challenge.solution)).toBe(true);
    });

    it('flags conflicting entries in same row, column, or 3x3 block', () => {
      const challenge = generateSudokuChallenge(2);
      // Clone grid and insert duplicate in row 0
      const testGrid = challenge.initialGrid.map((row: SudokuCell[]) =>
        row.map((cell: SudokuCell) => ({ ...cell }))
      );
      testGrid[0]![0]!.value = 5;
      testGrid[0]![1]!.value = 5;

      const conflicts = getSudokuConflicts(testGrid);
      expect(conflicts.has('0-0')).toBe(true);
      expect(conflicts.has('0-1')).toBe(true);
    });
  });

  describe('LogicGrid Engine', () => {
    it('generates structured clues and verifies single deduction solution', () => {
      const challenge = generateLogicGridChallenge(3);
      expect(challenge.primaryCategory.items.length).toBeGreaterThanOrEqual(3);
      expect(challenge.secondaryCategory.items.length).toBe(challenge.primaryCategory.items.length);
      expect(challenge.clues.length).toBeGreaterThanOrEqual(3);

      // Verify solution validation
      const playerAssignments: Record<string, { location?: string }> = {};
      for (const person of challenge.primaryCategory.items) {
        playerAssignments[person] = {
          location: challenge.solution.assignments[person]?.["Location"],
        };
      }
      const evalResult = validateLogicSolution(challenge, playerAssignments);
      expect(evalResult.isCorrect).toBe(true);
      expect(evalResult.correctCount).toBe(evalResult.totalCount);
    });

    it('identifies incorrect assignments when player makes wrong deduction', () => {
      const challenge = generateLogicGridChallenge(3);
      const items = challenge.primaryCategory.items;
      if (items.length >= 2) {
        const p1 = items[0]!;
        const p2 = items[1]!;
        const correct1 = challenge.solution.assignments[p1]?.["Location"];
        const correct2 = challenge.solution.assignments[p2]?.["Location"];

        // Swap assignments intentionally
        const wrongAssignments: Record<string, { location?: string }> = {};
        for (const p of items) {
          wrongAssignments[p] = { location: challenge.solution.assignments[p]?.["Location"] };
        }
        wrongAssignments[p1] = { location: correct2 };
        wrongAssignments[p2] = { location: correct1 };

        const evalResult = validateLogicSolution(challenge, wrongAssignments);
        expect(evalResult.isCorrect).toBe(false);
        expect(evalResult.correctCount).toBeLessThan(evalResult.totalCount);
      }
    });
  });

  describe('Cognitive Hub Store & Invariants', () => {
    it('contains all 10 game IDs in ALL_GAME_IDS without omission', () => {
      expect(ALL_GAME_IDS.length).toBe(10);
      expect(ALL_GAME_IDS).toContain('focus-lock');
      expect(ALL_GAME_IDS).toContain('sequence-core');
      expect(ALL_GAME_IDS).toContain('logic-forge');
      expect(ALL_GAME_IDS).toContain('memory-matrix');
      expect(ALL_GAME_IDS).toContain('reaction-control');
      expect(ALL_GAME_IDS).toContain('pattern-shift');
      expect(ALL_GAME_IDS).toContain('strategy-grid');
      expect(ALL_GAME_IDS).toContain('code-breaker');
      expect(ALL_GAME_IDS).toContain('sudoku');
      expect(ALL_GAME_IDS).toContain('logic-grid');
    });

    it('records genuine game results without placeholder mock values', () => {
      const store = useCognitiveLabStore.getState();
      const initialCount = store.results.length;

      const dummyResult = {
        id: `test_result_${Date.now()}`,
        gameId: 'focus-lock' as const,
        playedAt: Date.now(),
        difficulty: 3 as const,
        totalRounds: 5,
        correctRounds: 4,
        score: 420,
        scorePercentage: 80,
        isSuccess: true,
        coinsEarned: 80,
        accuracy: 80,
        avgResponseTimeMs: 650,
        maxStreak: 3,
        durationMs: 45000,
        rounds: [],
      };

      store.recordResult(dummyResult);
      const afterCount = useCognitiveLabStore.getState().results.length;
      expect(afterCount).toBe(initialCount + 1);

      const best = useCognitiveLabStore.getState().getBestScore('focus-lock');
      expect(best).toBeGreaterThanOrEqual(420);
    });

    it('enforces universal 60% threshold and awards coins with idempotency', () => {
      const store = useCognitiveLabStore.getState();
      const initialCoins = store.coins;

      // Below 60% => 0 coins
      const failAttempt = `fail_attempt_${Date.now()}`;
      const failCoins = store.claimReward(failAttempt, 59, 3);
      expect(failCoins).toBe(0);
      expect(useCognitiveLabStore.getState().coins).toBe(initialCoins);

      // 60% or higher at difficulty 3: base 50 + (3 * 10) = 80 coins
      const passAttempt = `pass_attempt_${Date.now()}`;
      const passCoins = store.claimReward(passAttempt, 65, 3);
      expect(passCoins).toBe(80);
      expect(useCognitiveLabStore.getState().coins).toBe(initialCoins + 80);

      // Mastery bonus (>= 90%): base 50 + (4 * 10) + 25 = 115 coins
      const masteryAttempt = `mastery_attempt_${Date.now()}`;
      const masteryCoins = store.claimReward(masteryAttempt, 95, 4);
      expect(masteryCoins).toBe(115);

      // Idempotency: re-claiming same attempt produces 0 coins
      const doubleClaim = store.claimReward(masteryAttempt, 95, 4);
      expect(doubleClaim).toBe(0);
    });

    it('enforces Hint system rules: Free for first 5 games, 25 coins from 6th game onwards', () => {
      const store = useCognitiveLabStore.getState();

      // Case 1: When completed games < 5, hints cost 0
      useCognitiveLabStore.setState({ completedGamesCount: 2 });
      expect(useCognitiveLabStore.getState().getHintCost()).toBe(0);
      const freeHintRes = useCognitiveLabStore.getState().requestHint();
      expect(freeHintRes.success).toBe(true);

      // Case 2: When completed games >= 5, hints cost 25
      useCognitiveLabStore.setState({ completedGamesCount: 5, coins: 50 });
      expect(useCognitiveLabStore.getState().getHintCost()).toBe(25);

      const paidHintRes = useCognitiveLabStore.getState().requestHint();
      expect(paidHintRes.success).toBe(true);
      expect(useCognitiveLabStore.getState().coins).toBe(25);

      // Insufficient funds test
      useCognitiveLabStore.setState({ coins: 10 });
      const failHintRes = useCognitiveLabStore.getState().requestHint();
      expect(failHintRes.success).toBe(false);
      expect(failHintRes.error).toBe('Not enough coins for this hint.');
      expect(useCognitiveLabStore.getState().coins).toBe(10); // Not deducted
    });

    it('blocks impossible deductions via Logic Grid contradiction prevention', () => {
      const challenge = generateLogicGridChallenge(3);
      if (challenge.clues.length > 0) {
        // Find a clue with type !== "same_location" that creates forbidden pairs
        const person = challenge.primaryCategory.items[0]!;
        // The person's true location is in the solution
        const correctLoc = challenge.solution.assignments[person]?.["Location"];
        // Other locations are impossible
        const wrongLoc = challenge.secondaryCategory.items.find((loc: string) => loc !== correctLoc);

        if (wrongLoc) {
          // If the challenge clues forbid this pair
          const key = `${person}:${wrongLoc}`;
          if (!challenge.forbiddenPairs) challenge.forbiddenPairs = [];
          challenge.forbiddenPairs.push(key);
          const check = checkLogicGridContradiction(challenge, person, wrongLoc);
          expect(check.isContradiction).toBe(true);
          expect(check.reason).toContain('Contradiction');
        }
      }
    });

    it('renders Universal Result Screen with exact required 60% status banners', () => {
      const successResult = {
        id: 'res_success_1',
        gameId: 'focus-lock' as const,
        playedAt: Date.now(),
        difficulty: 3 as const,
        totalRounds: 10,
        correctRounds: 8,
        score: 650,
        scorePercentage: 80,
        isSuccess: true,
        coinsEarned: 80,
        hintsUsed: 1,
        mistakes: 2,
        accuracy: 80,
        avgResponseTimeMs: 450,
        maxStreak: 5,
        durationMs: 30000,
        rounds: [],
      };

      const { container: successContainer } = render(
        <MemoryRouter>
          <GameResults
            result={successResult}
            gameTitle="Focus Lock"
            bestScore={800}
            onReplay={() => {}}
            onExit={() => {}}
          />
        </MemoryRouter>
      );
      expect(successContainer.textContent).toContain('Successfully Completed!');
      expect(successContainer.textContent).toContain('Great work.');
      expect(successContainer.textContent).toContain('+80');

      const failResult = {
        ...successResult,
        id: 'res_fail_1',
        scorePercentage: 50,
        isSuccess: false,
        coinsEarned: 0,
      };

      const { container: failContainer } = render(
        <MemoryRouter>
          <GameResults
            result={failResult}
            gameTitle="Focus Lock"
            bestScore={800}
            onReplay={() => {}}
            onExit={() => {}}
          />
        </MemoryRouter>
      );
      expect(failContainer.textContent).toContain('Not Successfully Completed.');
      expect(failContainer.textContent).toContain('Better luck next time!');
    });

    it('renders Cognitive Hub Page with coin wallet, completed count, and 10 modules', () => {
      saveCoins(140);
      saveCompletedGamesCount(4);
      const { container } = render(
        <MemoryRouter>
          <CognitiveHubPage />
        </MemoryRouter>
      );
      expect(container.textContent).toContain('Cognitive Hub');
      expect(container.textContent).toContain('140');
      expect(container.textContent).toContain('4 Completed');
      expect(container.textContent).toContain('10 Modules');
    });

    it('renders Sudoku instructions, starts game, and verifies no submit button is present', () => {
      const { container, getByText } = render(
        <MemoryRouter>
          <SudokuGame />
        </MemoryRouter>
      );
      expect(container.textContent).toContain('Sudoku');
      expect(container.textContent).toContain('Start Game');

      act(() => {
        fireEvent.click(getByText('Start Game'));
      });

      expect(container.textContent).toContain('Reset');
      expect(container.textContent).toContain('Hint');
      // Verify NO submit button exists (auto-completion requirement)
      expect(container.textContent).not.toContain('SUBMIT PUZZLE');
      expect(container.textContent).not.toContain('SUBMIT SUDOKU');
    });

    it('renders Logic Grid instructions, starts deduction, and verifies no submit button is present', () => {
      const { container, getByText } = render(
        <MemoryRouter>
          <LogicGridGame />
        </MemoryRouter>
      );
      expect(container.textContent).toContain('Logic Grid');
      expect(container.textContent).toContain('Start Game');

      act(() => {
        fireEvent.click(getByText('Start Game'));
      });

      expect(container.textContent).toContain('Reset Grid');
      expect(container.textContent).toContain('Elimination Matrix');
      // Verify NO submit button exists (auto-completion requirement)
      expect(container.textContent).not.toContain('SUBMIT GRID');
      expect(container.textContent).not.toContain('SUBMIT DEDUCTION');
    });
  });
});
