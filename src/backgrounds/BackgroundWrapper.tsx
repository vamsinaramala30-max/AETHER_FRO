import React, { LazyExoticComponent, lazy, Suspense } from 'react';
import { CursorGlow } from '../components/effects/CursorGlow';
import { NoiseOverlay } from '../components/effects/NoiseOverlay';

export type BackgroundType =
  'home' | 'chat' | 'knowledge' | 'projects' | 'analytics' | 'workspace' | 'auth' | 'settings';

const backgroundMap: Record<BackgroundType, LazyExoticComponent<React.FC>> = {
  home: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))),
  chat: lazy(() => import('./ChatBackground').then((m) => ({ default: m.ChatBackground }))),
  knowledge: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))), // Fallback map
  projects: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))),
  analytics: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))),
  workspace: lazy(() =>
    import('./WorkspaceBackground').then((m) => ({ default: m.WorkspaceBackground })),
  ),
  auth: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))),
  settings: lazy(() => import('./HomeBackground').then((m) => ({ default: m.HomeBackground }))),
};

interface BackgroundWrapperProps {
  type: BackgroundType;
  children: React.ReactNode;
  showCursorGlow?: boolean;
  showNoise?: boolean;
  className?: string;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  type,
  children,
  showCursorGlow = true,
  showNoise = true,
  className = '',
}) => {
  const BackgroundComponent = backgroundMap[type] || backgroundMap.home;

  return (
    <div
      className={`isolation-isolate relative min-h-screen w-full bg-[#050816] text-[#F8FAFC] ${className}`}
    >
      {/* Background layer container */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-[#050816]" />}>
          <BackgroundComponent />
        </Suspense>
        {showNoise && <NoiseOverlay />}
      </div>

      {/* Foreground interactive content layer */}
      <div className="pointer-events-auto relative z-20 h-full w-full">{children}</div>

      {/* Non-blocking cursor glow */}
      {showCursorGlow && <CursorGlow />}
    </div>
  );
};
