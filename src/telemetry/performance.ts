import { analytics } from './analytics';
import { logger } from './logger';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
}

export const performanceMonitor = {
  mark(name: string): void {
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
      performance.mark(name);
    }
  },

  measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof performance !== 'undefined' && typeof performance.measure === 'function') {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, 'measure');
        const latestEntry = entries[entries.length - 1];
        const duration =
          typeof latestEntry !== 'undefined' && typeof latestEntry.duration === 'number'
            ? latestEntry.duration
            : null;

        if (duration !== null) {
          logger.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
          analytics.track('performance_metric', { metric: name, duration });
        }
        return duration;
      } catch (err) {
        logger.warn(`[Performance] Measurement failed for ${name}`, { error: err });
      }
    }
    return null;
  },

  capturePageTimings(): void {
    if (typeof window === 'undefined' || typeof window.performance === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined;
    if (navigation !== undefined) {
      const pageLoadTime = navigation.loadEventEnd - navigation.startTime;
      const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
      const ttfb = navigation.responseStart - navigation.requestStart;

      analytics.track('page_performance', {
        pageLoadTime,
        dnsTime,
        ttfb,
        domInteractive: navigation.domInteractive,
      });
    }
  },
};
