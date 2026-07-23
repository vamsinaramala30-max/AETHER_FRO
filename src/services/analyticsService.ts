export class AnalyticsService {
  public trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event]: ${eventName}`, properties);
    }
  }
}

export const analyticsService = new AnalyticsService();