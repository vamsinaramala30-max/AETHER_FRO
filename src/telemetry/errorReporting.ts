import { logger } from './logger';
import { analytics } from './analytics';

export interface ErrorReportOptions {
  handled?: boolean;
  severity?: 'fatal' | 'error' | 'warning';
  metadata?: Record<string, unknown>;
}

export class ErrorReporter {
  public static captureException(error: Error, options: ErrorReportOptions = {}): void {
    const { handled = true, severity = 'error', metadata = {} } = options;

    logger.error(`[ErrorReporter] ${error.name}: ${error.message}`, error, {
      handled,
      severity,
      ...metadata,
    });

    analytics.track('exception_captured', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      handled,
      severity,
      ...metadata,
    });
  }

  public static initializeGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    window.onerror = (message, source, lineno, colno, error) => {
      ErrorReporter.captureException(error || new Error(String(message)), {
        handled: false,
        severity: 'fatal',
        metadata: { source, lineno, colno },
      });
    };

    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      ErrorReporter.captureException(error, {
        handled: false,
        severity: 'error',
        metadata: { type: 'unhandled_rejection' },
      });
    };
  }
}