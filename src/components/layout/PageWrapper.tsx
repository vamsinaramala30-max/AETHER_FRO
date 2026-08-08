// src/components/layout/PageWrapper.tsx
// Shared wrapper that applies consistent padding & max-width to every page.

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Set to true for wide pages that should not be capped at max-w-7xl */
  wide?: boolean;
}

/**
 * Use this at the root of every authenticated content page so that
 * padding and max-width are always identical across the app.
 *
 * Pages that need full-height / full-bleed layouts (Calendar, AI Assistant)
 * should NOT use this wrapper – they manage their own layout.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  wide = false,
}) => (
  <div
    className={`mx-auto w-[95%] space-y-6 p-4 sm:p-6 md:w-full lg:p-8 ${
      wide ? 'max-w-screen-2xl' : 'max-w-7xl'
    } ${className}`}
  >
    {children}
  </div>
);

export default PageWrapper;
