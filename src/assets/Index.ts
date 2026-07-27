/**
 * AETHER Asset Management System
 */

// Asset Manifest Registry Map
export const ASSET_PATHS = {
  logos: {
    primary: '/assets/logos/aether-logo-primary.svg',
    symbol: '/assets/logos/aether-symbol.svg',
    dark: '/assets/logos/aether-logo-dark.svg',
  },
  placeholders: {
    avatar: '/assets/placeholders/avatar-placeholder.png',
    projectCover: '/assets/placeholders/cover-placeholder.png',
  },
  illustrations: {
    emptyState: '/assets/illustrations/empty-state.svg',
    notFound: '/assets/illustrations/404.svg',
    aiAgent: '/assets/illustrations/ai-agent.svg',
  },
  lottie: {
    aiThinking: '/assets/lottie/ai-thinking.json',
    successCheck: '/assets/lottie/success-check.json',
  },
  manifest: '/assets/manifest/site.webmanifest',
  favicon: '/assets/favicon/favicon.ico',
} as const;

export type AssetPathRegistry = typeof ASSET_PATHS;
