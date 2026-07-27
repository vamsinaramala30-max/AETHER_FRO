import { env } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isProduction = env.NODE_ENV === 'production';

  private format(level: LogLevel, message: string, data?: unknown): LogPayload {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private dispatch(payload: LogPayload): void {
    if (this.isProduction && payload.level === 'debug') {
      return; // Suppress debug logs in production
    }

    const formatted = `[${payload.timestamp}] [${payload.level.toUpperCase()}] ${payload.message}`;

    switch (payload.level) {
      case 'debug':
      case 'info':
      case 'warn':
        console.warn(formatted, payload.data ?? '');
        break;
      case 'error':
        console.error(formatted, payload.data ?? '');
        break;
    }
  }

  debug(message: string, data?: unknown): void {
    this.dispatch(this.format('debug', message, data));
  }

  info(message: string, data?: unknown): void {
    this.dispatch(this.format('info', message, data));
  }

  warn(message: string, data?: unknown): void {
    this.dispatch(this.format('warn', message, data));
  }

  error(message: string, data?: unknown): void {
    this.dispatch(this.format('error', message, data));
  }
}

export const logger = new Logger();
