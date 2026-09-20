/**
 * CognitiveHubGamePage.tsx
 *
 * React Router–compatible game page for the Cognitive Hub.
 * Uses useParams from react-router-dom instead of TanStack Router.
 * Wraps each of the 8 existing game components unchanged.
 *
 * Route: /app/cognitive-hub/:gameId
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { GameId } from '../ether-thought-hub/src/lib/cognitive-lab/types';
import { FocusLockGame } from '../ether-thought-hub/src/components/cognitive-lab/games/FocusLock';
import { MemoryMatrixGame } from '../ether-thought-hub/src/components/cognitive-lab/games/MemoryMatrix';
import { LogicForgeGame } from '../ether-thought-hub/src/components/cognitive-lab/games/LogicForge';
import { PatternShiftGame } from '../ether-thought-hub/src/components/cognitive-lab/games/PatternShift';
import { SequenceCoreGame } from '../ether-thought-hub/src/components/cognitive-lab/games/SequenceCore';
import { ReactionControlGame } from '../ether-thought-hub/src/components/cognitive-lab/games/ReactionControl';
import { StrategyGridGame } from '../ether-thought-hub/src/components/cognitive-lab/games/StrategyGrid';
import { CodeBreakerGame } from '../ether-thought-hub/src/components/cognitive-lab/games/CodeBreaker';
import { SudokuGame } from '../ether-thought-hub/src/components/cognitive-lab/games/Sudoku';
import { LogicGridGame } from '../ether-thought-hub/src/components/cognitive-lab/games/LogicGrid';
import { useCognitiveLabStore } from '../ether-thought-hub/src/stores/cognitive-lab-store';

class CognitiveGameErrorBoundary extends React.Component<
  { children: React.ReactNode; onReturn: () => void },
  { hasError: boolean; error: Error | null }
> {
  override state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 p-4 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
          <div className="max-w-md space-y-4 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-rose-600">Game Module Error</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unable to run this cognitive module.
            </p>
            <button
              type="button"
              onClick={this.props.onReturn}
              className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Return to Cognitive Hub
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CognitiveHubGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const store = useCognitiveLabStore();

  // Hydrate store from localStorage on mount
  React.useEffect(() => {
    store.hydrate();
  }, []);

  // All game components use onBack callbacks internally via GameShell — they call
  // window.history.back() or an onBack prop. We intercept at the route level.
  // Each game component is fully self-contained.

  const renderGame = () => {
    switch (gameId as GameId) {
      case 'focus-lock':
        return <FocusLockGame />;
      case 'memory-matrix':
        return <MemoryMatrixGame />;
      case 'logic-forge':
        return <LogicForgeGame />;
      case 'pattern-shift':
        return <PatternShiftGame />;
      case 'sequence-core':
        return <SequenceCoreGame />;
      case 'reaction-control':
        return <ReactionControlGame />;
      case 'strategy-grid':
        return <StrategyGridGame />;
      case 'code-breaker':
        return <CodeBreakerGame />;
      case 'sudoku':
        return <SudokuGame />;
      case 'logic-grid':
        return <LogicGridGame />;
      default:
        return (
          <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 p-4 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <div className="max-w-md space-y-4 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Game Not Found</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The requested cognitive game module &ldquo;{gameId}&rdquo; does not exist.
              </p>
              <button
                type="button"
                onClick={() => navigate('/app/cognitive-hub')}
                className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Return to Cognitive Hub
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <CognitiveGameErrorBoundary onReturn={() => navigate('/app/cognitive-hub')}>
      {renderGame()}
    </CognitiveGameErrorBoundary>
  );
};

export default CognitiveHubGamePage;
