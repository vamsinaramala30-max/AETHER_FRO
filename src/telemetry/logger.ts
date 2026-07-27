export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

export type LogHandler = (entry: LogEntry) => void;

class Logger {
  private handlers: LogHandler[] = [];
  private level: LogLevel = 'info';

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public addHandler(handler: LogHandler): void {
    this.handlers.push(handler);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private dispatch(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    if (this.handlers.length === 0) {
      const consoleArgs = [
        `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
        context ? context : '',
        error ? error : '',
      ].filter(Boolean);

      switch (level) {
        case 'debug':
        case 'info':
        case 'warn':
          console.warn(...consoleArgs);
          break;
        case 'error':
          console.error(...consoleArgs);
          break;
      }
      return;
    }

    this.handlers.forEach((handler) => {
      try {
        handler(entry);
      } catch (err) {
        console.error('Failed to dispatch log entry to handler:', err);
      }
    });
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.dispatch('debug', message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.dispatch('info', message, context);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.dispatch('warn', message, context);
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.dispatch('error', message, context, error);
  }
}

export const logger = new Logger();
