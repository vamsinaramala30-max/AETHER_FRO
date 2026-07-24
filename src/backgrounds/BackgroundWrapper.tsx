import React, { LazyExoticComponent, lazy, Suspense } from "react";
import { CursorGlow } from "../effects/CursorGlow";
import { NoiseOverlay } from "../effects/NoiseOverlay";

export type BackgroundType =
  | "home"
  | "chat"
  | "knowledge"
  | "projects"
  | "analytics"
  | "workspace"
  | "auth"
  | "settings";

const backgroundMap: Record<BackgroundType, LazyExoticComponent<React.FC>> = {
  home: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))),
  chat: lazy(() => import("../../backgrounds/ChatBackground").then((m) => ({ default: m.ChatBackground }))),
  knowledge: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))), // Fallback map
  projects: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))),
  analytics: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))),
  workspace: lazy(() => import("../../backgrounds/WorkspaceBackground").then((m) => ({ default: m.WorkspaceBackground }))),
  auth: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))),
  settings: lazy(() => import("../../backgrounds/HomeBackground").then((m) => ({ default: m.HomeBackground }))),
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
  className = "",
}) => {
  const BackgroundComponent = backgroundMap[type] || backgroundMap.home;

  return (
    <div className={`relative min-h-screen w-full bg-[#050816] text-[#F8FAFC] isolation-isolate ${className}`}>
      {/* Background layer container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Suspense fallback={<div className="absolute inset-0 bg-[#050816]" />}>
          <BackgroundComponent />
        </Suspense>
        {showNoise && <NoiseOverlay />}
      </div>

      {/* Foreground interactive content layer */}
      <div className="relative z-20 w-full h-full pointer-events-auto">
        {children}
      </div>

      {/* Non-blocking cursor glow */}
      {showCursorGlow && <CursorGlow />}
    </div>
  );
};