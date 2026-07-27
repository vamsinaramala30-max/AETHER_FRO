import { logger } from './logger';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface AnalyticsProvider {
  track: (event: AnalyticsEvent) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  page: (name: string, properties?: Record<string, unknown>) => void;
}

class AnalyticsService {
  private providers: AnalyticsProvider[] = [];

  public registerProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
  }

  public track(name: string, properties?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    logger.debug(`[Analytics] Track: ${name}`, properties);

    this.providers.forEach((provider) => {
      try {
        provider.track(event);
      } catch (err) {
        logger.error(`[Analytics] Provider track failed for ${name}`, err as Error);
      }
    });
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    logger.info(`[Analytics] Identify: ${userId}`, traits);
    this.providers.forEach((provider) => {
      try {
        provider.identify(userId, traits);
      } catch (err) {
        logger.error(`[Analytics] Provider identify failed for ${userId}`, err as Error);
      }
    });
  }

  public page(name: string, properties?: Record<string, unknown>): void {
    logger.debug(`[Analytics] Page View: ${name}`, properties);
    this.providers.forEach((provider) => {
      try {
        provider.page(name, properties);
      } catch (err) {
        logger.error(`[Analytics] Provider page failed for ${name}`, err as Error);
      }
    });
  }

  public trackAIInteraction(
    action: string,
    model: string,
    durationMs: number,
    tokens?: number,
  ): void {
    this.track('ai_interaction', {
      action,
      model,
      durationMs,
      tokens,
    });
  }
}

export const analytics = new AnalyticsService();
