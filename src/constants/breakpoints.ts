/**
 * Responsive viewports (pixels) following tailwind standard scale.
 */
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
