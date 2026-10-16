import React from 'react';

// =============================================================================
// AetherLogo — Concept 1 "The Core"
// =============================================================================
// Faithful reproduction of Concept 1 ("The Core") from the official brand assets:
// - Folded dimensional ribbon 'A' with cyan-to-purple gradient
// - Central glowing cyan sphere floating inside the arch
// - Diagonal orbital ring with glowing cyan perspective stroke
// - Satellite orb on the orbital ring
// - Clean modern geometric wordmark & "AI OPERATING SYSTEM" tagline
// =============================================================================

export interface AetherLogoProps {
  /** 'full' = symbol + wordmark + tagline; 'wordmark' = symbol + text; 'symbol' = icon only */
  variant?: 'full' | 'wordmark' | 'symbol';
  /** CSS class applied to the outer wrapper */
  className?: string;
  /** Size in pixels (applies to symbol height/width). Defaults to 32 */
  size?: number;
  /** Show the tagline "AI OPERATING SYSTEM" under the wordmark */
  showTagline?: boolean;
  /** Custom text color class for wordmark (default: text-white) */
  textColor?: string;
}

/**
 * SVG reproduction of Concept 1 — "The Core" logo.
 * Precision curved ribbon 'A', luminous sphere, angled orbital ring with satellite.
 */
export const AetherSymbol: React.FC<{ size?: number; className?: string; idPrefix?: string }> = ({
  size = 32,
  className = '',
  idPrefix = 'core',
}) => {
  const p = idPrefix;

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Soft atmospheric ambient glow */}
        <filter id={`${p}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Sphere glow */}
        <filter id={`${p}-sphere-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ring glow */}
        <filter id={`${p}-ring-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ribbon A - Left side / apex gradient (cyan to deep royal blue) */}
        <linearGradient id={`${p}-ribbon-left`} x1="20%" y1="90%" x2="65%" y2="15%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="45%" stopColor="#00B0FF" />
          <stop offset="85%" stopColor="#2979FF" />
          <stop offset="100%" stopColor="#3D5AFE" />
        </linearGradient>

        {/* Ribbon A - Right side fold (royal blue to vivid violet/magenta) */}
        <linearGradient id={`${p}-ribbon-right`} x1="50%" y1="20%" x2="95%" y2="90%">
          <stop offset="0%" stopColor="#3D5AFE" />
          <stop offset="40%" stopColor="#651FFF" />
          <stop offset="75%" stopColor="#7C4DFF" />
          <stop offset="100%" stopColor="#B388FF" />
        </linearGradient>

        {/* Ribbon front overlay curve for dimensional fold */}
        <linearGradient id={`${p}-ribbon-highlight`} x1="30%" y1="10%" x2="80%" y2="60%">
          <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#80D8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#651FFF" stopOpacity="0" />
        </linearGradient>

        {/* Orbital Ring Gradient */}
        <linearGradient id={`${p}-ring-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#80D8FF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#B388FF" stopOpacity="0.3" />
        </linearGradient>

        {/* 3D Cyan Sphere (The Core) */}
        <radialGradient id={`${p}-sphere-grad`} cx="38%" cy="34%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#84FFFF" />
          <stop offset="65%" stopColor="#00E5FF" />
          <stop offset="90%" stopColor="#0091EA" />
          <stop offset="100%" stopColor="#01579B" />
        </radialGradient>
      </defs>

      {/* ── Background soft ethereal glow ────────────────────────────── */}
      <circle cx="80" cy="80" r="54" fill="#00E5FF" opacity="0.08" filter="url(#${p}-glow)" />
      <circle cx="95" cy="90" r="45" fill="#7C4DFF" opacity="0.09" filter="url(#${p}-glow)" />

      {/* ── Outer Dimensional A-Ribbon ─────────────────────────────────── */}
      <g filter={`url(#${p}-glow)`}>
        {/* Right leg and inner fold (behind) */}
        <path
          d="M80 24 
             C94 24, 108 42, 116 58 
             L136 102 
             C141 113, 137 122, 126 122 
             L106 122 
             C99 122, 94 116, 91 108 
             L83 86 
             C81 81, 79 81, 77 86 
             L80 24 Z"
          fill={`url(#${p}-ribbon-right)`}
        />

        {/* Left leg extending up to apex (front ribbon fold) */}
        <path
          d="M80 22 
             C72 22, 64 28, 59 38 
             L22 106 
             C17 116, 22 122, 33 122 
             L54 122 
             C62 122, 67 116, 71 108 
             L80 84 
             C82 78, 86 78, 88 84 
             L93 96 
             C97 86, 99 74, 98 62 
             C96 46, 90 22, 80 22 Z"
          fill={`url(#${p}-ribbon-left)`}
        />

        {/* Specular sheen / curve highlight along left shoulder */}
        <path
          d="M80 24 
             C74 24, 67 29, 63 37 
             L32 100 
             C35 94, 38 88, 41 82 
             L68 33 
             C72 26, 76 24, 80 24 Z"
          fill={`url(#${p}-ribbon-highlight)`}
          opacity="0.85"
        />

        {/* Inner triangular hollow cutout shading */}
        <path
          d="M80 48 
             C75 56, 70 68, 66 78 
             L94 78 
             C90 68, 85 56, 80 48 Z"
          fill="#050B14"
          opacity="0.75"
        />
      </g>

      {/* ── Central Luminous Sphere (The Core) ─────────────────────────── */}
      <g filter={`url(#${p}-sphere-glow)`}>
        {/* Soft sphere aura */}
        <circle cx="80" cy="74" r="14" fill="#00E5FF" opacity="0.25" />
        {/* Sphere body */}
        <circle cx="80" cy="74" r="11" fill={`url(#${p}-sphere-grad)`} />
        {/* Sphere specular highlight */}
        <ellipse cx="76.5" cy="70.5" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.9" transform="rotate(-20 76.5 70.5)" />
      </g>

      {/* ── Diagonal Orbital Ring with Satellite ───────────────────────── */}
      <g filter={`url(#${p}-ring-glow)`}>
        {/* Back segment of orbital ring (faded/subtle) */}
        <ellipse
          cx="80"
          cy="77"
          rx="58"
          ry="15"
          stroke={`url(#${p}-ring-grad)`}
          strokeWidth="2.4"
          fill="none"
          transform="rotate(-24 80 77)"
          strokeDasharray="180 80"
          strokeDashoffset="40"
          opacity="0.8"
        />

        {/* Front segment of orbital ring (brighter, glowing cyan) */}
        <ellipse
          cx="80"
          cy="77"
          rx="58"
          ry="15"
          stroke="#00E5FF"
          strokeWidth="2.8"
          fill="none"
          transform="rotate(-24 80 77)"
          strokeDasharray="140 180"
          strokeDashoffset="170"
          opacity="0.95"
        />

        {/* Satellite Orb on the orbital ring (upper right orbit) */}
        <g transform="translate(131, 57)">
          <circle cx="0" cy="0" r="6" fill="#00E5FF" opacity="0.35" />
          <circle cx="0" cy="0" r="3.8" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="2.8" fill="#00E5FF" />
          <circle cx="-0.8" cy="-0.8" r="1" fill="#FFFFFF" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Full Aether logo component matching Concept 1 ("The Core"):
 * - `symbol`: Just the iconic emblem
 * - `wordmark`: Emblem + "Aether" text
 * - `full`: Emblem + "Aether" text + "AI OPERATING SYSTEM" tagline
 */
export const AetherLogo: React.FC<AetherLogoProps> = ({
  variant = 'wordmark',
  className = '',
  size = 32,
  showTagline,
  textColor = 'text-white',
}) => {
  if (variant === 'symbol') {
    return <AetherSymbol size={size} className={className} />;
  }

  const shouldShowTagline = showTagline ?? variant === 'full';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <AetherSymbol size={size} />
      <div className="min-w-0 flex flex-col justify-center">
        <span
          className={`block font-bold tracking-tight ${textColor}`}
          style={{
            fontSize: `${Math.round(size * 0.58)}px`,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Aether
        </span>
        {shouldShowTagline && (
          <span
            className="block font-semibold tracking-widest text-cyan-400"
            style={{
              fontSize: `${Math.max(9, Math.round(size * 0.22))}px`,
              lineHeight: 1.2,
              letterSpacing: '0.2em',
              marginTop: '2px',
            }}
          >
            AI OPERATING SYSTEM
          </span>
        )}
      </div>
    </div>
  );
};

export default AetherLogo;

