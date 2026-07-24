// frontend/src/main.tsx

import React, { StrictMode, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App } from './app/App';
import './styles/global.css';

// ============================================================================
// Core Configuration & Global Clients
// ============================================================================

/**
 * Global TanStack Query Client configured for production performance and caching.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ============================================================================
// Error Boundary Component
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Root Error Boundary to catch uncaught runtime errors and provide a resilient fallback UI.
 */
class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Standard error logging pipeline hook (e.g., telemetry/analytics)
    console.error('Uncaught Error in AETHER Core:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="aria-error-screen flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 p-6 text-slate-100 font-sans"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-white">System Exception</h1>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              A critical runtime issue occurred. The application state was preserved safely.
            </p>
            {this.state.error && (
              <pre className="mb-6 max-h-32 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs font-mono text-slate-300 border border-slate-800/80">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Loading Fallback Component
// ============================================================================

/**
 * Top-level application loading screen for code-split lazy routes and initialization.
 */
function RootLoadingFallback(): ReactNode {
  return (
    <div
      role="status"
      aria-label="Loading AETHER application"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 text-slate-100"
    >
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute h-6 w-6 rounded-full border-2 border-cyan-500/20 border-b-cyan-400 animate-spin flex-row-reverse" />
      </div>
      <p className="mt-4 text-xs font-medium tracking-widest text-slate-400 uppercase">
        Initializing AETHER...
      </p>
    </div>
  );
}

// ============================================================================
// Application Bootstrapping
// ============================================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Fatal: Root container element "#root" was not found in the DOM.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<RootLoadingFallback />}>
            <App />
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>
);