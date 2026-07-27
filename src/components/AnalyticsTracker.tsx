import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from '../lib/analytics';

interface AnalyticsTrackerProps {
  /** Optional custom flag to mark route paths as 404 */
  isNotFoundPage?: boolean;
}

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ isNotFoundPage = false }) => {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // 1. Ensure GA is initialized
    initGA();
  }, []);

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}${location.hash}`;

    // 2. Prevent duplicate tracking calls for the same URL path
    if (lastTrackedPath.current === currentPath) {
      return;
    }

    lastTrackedPath.current = currentPath;

    // 3. Track regular route or 404 view
    const title = isNotFoundPage ? '404 - Page Not Found' : document.title;
    trackPageView(currentPath, title);
  }, [location, isNotFoundPage]);

  return null;
};
