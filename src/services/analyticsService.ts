export const analyticsService = {
  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
      console.warn(`[Analytics Event]: ${eventName}`, properties);
    }
  },
};
