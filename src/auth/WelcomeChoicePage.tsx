// src/auth/WelcomeChoicePage.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/authprovider';
import { normalizeUserProfile } from '@/auth/userProfile';
import { getLastSession, setLastSession, isValidDestination } from '@/your-aether/useLastSession';
import { AetherSymbol } from '@/components/branding/AetherLogo';
import './welcome-choice.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

// 1. Open to Workspace: Application/Browser window with titlebar dots + 2x2 grid panes
const WorkspaceIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="wc-icon-svg"
  >
    {/* Window frame */}
    <rect
      x="2.5"
      y="3.5"
      width="19"
      height="17"
      rx="3"
      stroke="#ffffff"
      strokeWidth="1.8"
      fill="rgba(255, 255, 255, 0.12)"
    />
    {/* Header bar divider */}
    <line x1="2.5" y1="8" x2="21.5" y2="8" stroke="#ffffff" strokeWidth="1.6" />
    {/* Header dots */}
    <circle cx="5.5" cy="5.8" r="0.9" fill="#ffffff" />
    <circle cx="8" cy="5.8" r="0.9" fill="#ffffff" />
    <circle cx="10.5" cy="5.8" r="0.9" fill="#ffffff" />
    {/* 4 pane grid inside */}
    <rect x="5.5" y="10.5" width="5.5" height="3.8" rx="1" fill="#ffffff" />
    <rect x="13" y="10.5" width="5.5" height="3.8" rx="1" fill="#ffffff" />
    <rect x="5.5" y="15.3" width="5.5" height="3.2" rx="1" fill="#ffffff" />
    <rect x="13" y="15.3" width="5.5" height="3.2" rx="1" fill="#ffffff" />
  </svg>
);

// 2. Explore YOUR AETHER: 4-petal floral / app launcher sparkle emblem
const LauncherIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="wc-icon-svg"
  >
    {/* 4 petals radiating from center with central sparkle notch */}
    <path d="M12 2.5C10.6 2.5 9.4 4 9.4 5.9C9.4 7.8 10.7 9.3 12 9.8C13.3 9.3 14.6 7.8 14.6 5.9C14.6 4 13.4 2.5 12 2.5Z" />
    <path d="M12 21.5C10.6 21.5 9.4 20 9.4 18.1C9.4 16.2 10.7 14.7 12 14.2C13.3 14.7 14.6 16.2 14.6 18.1C14.6 20 13.4 21.5 12 21.5Z" />
    <path d="M2.5 12C2.5 10.6 4 9.4 5.9 9.4C7.8 9.4 9.3 10.7 9.8 12C9.3 13.3 7.8 14.6 5.9 14.6C4 14.6 2.5 13.4 2.5 12Z" />
    <path d="M21.5 12C21.5 10.6 20 9.4 18.1 9.4C16.2 9.4 14.7 10.7 14.2 12C14.7 13.3 16.2 14.6 18.1 14.6C20 14.6 21.5 13.4 21.5 12Z" />
    {/* Center diamond core */}
    <polygon points="12,10 14,12 12,14 10,12" fill="currentColor" />
  </svg>
);

// 3. Continue Last Session: Circular rewind arrow enclosing clock
const SessionIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="wc-icon-svg"
  >
    {/* Circular counter-clockwise arc */}
    <path
      d="M12 4.5A7.5 7.5 0 1 0 19.5 12"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Counter-clockwise arrow head */}
    <path
      d="M8.5 2.5L12 4.5L9.5 7.5"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Clock hands pointing up and left */}
    <path
      d="M12 8.5V12L9.5 13.5"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



// ── Ethereal Wave Background ───────────────────────────────────────────────────

const WaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    timeRef.current += 0.007;
    const t = timeRef.current;

    // Deep cosmic space atmosphere
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.95,
      0,
      width * 0.5,
      height * 0.8,
      width * 0.8,
    );
    bgGrad.addColorStop(0, 'rgba(14, 34, 82, 0.45)');
    bgGrad.addColorStop(0.5, 'rgba(8, 18, 48, 0.25)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ethereal flowing light ribbons and filament waves across the bottom
    ctx.globalCompositeOperation = 'screen';

    // 1. Deep blue-violet filled base nebula wave
    const waveLayers = [
      {
        amp: 45,
        freq: 0.008,
        speed: 1.0,
        phase: 0,
        yBase: 0.78,
        colors: ['rgba(37, 99, 235, 0.20)', 'rgba(79, 70, 229, 0.12)', 'rgba(0,0,0,0)'],
      },
      {
        amp: 36,
        freq: 0.012,
        speed: -0.8,
        phase: 1.8,
        yBase: 0.82,
        colors: ['rgba(168, 85, 247, 0.18)', 'rgba(99, 102, 241, 0.10)', 'rgba(0,0,0,0)'],
      },
      {
        amp: 28,
        freq: 0.016,
        speed: 1.3,
        phase: 3.2,
        yBase: 0.86,
        colors: ['rgba(6, 182, 212, 0.22)', 'rgba(56, 189, 248, 0.12)', 'rgba(0,0,0,0)'],
      },
      {
        amp: 20,
        freq: 0.020,
        speed: -1.1,
        phase: 4.5,
        yBase: 0.90,
        colors: ['rgba(192, 132, 252, 0.16)', 'rgba(14, 165, 233, 0.08)', 'rgba(0,0,0,0)'],
      },
    ];

    for (const w of waveLayers) {
      ctx.beginPath();
      const baseY = height * w.yBase;
      ctx.moveTo(0, baseY);

      for (let x = 0; x <= width; x += 4) {
        const y =
          baseY +
          Math.sin(x * w.freq + t * w.speed + w.phase) * w.amp +
          Math.cos(x * w.freq * 0.5 + t * 0.4) * (w.amp * 0.35);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, baseY - w.amp, 0, height);
      grad.addColorStop(0, w.colors[0]);
      grad.addColorStop(0.5, w.colors[1]);
      grad.addColorStop(1, w.colors[2]);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 2. High-intensity luminous filament strokes (fine neon wave threads)
    const filaments = [
      { amp: 40, freq: 0.009, speed: 1.1, phase: 0.5, yBase: 0.80, color: 'rgba(56, 189, 248, 0.55)', width: 1.8 },
      { amp: 32, freq: 0.014, speed: -0.9, phase: 2.1, yBase: 0.84, color: 'rgba(192, 132, 252, 0.50)', width: 1.6 },
      { amp: 26, freq: 0.018, speed: 1.4, phase: 3.7, yBase: 0.88, color: 'rgba(34, 211, 238, 0.65)', width: 2.0 },
      { amp: 18, freq: 0.024, speed: -1.2, phase: 5.0, yBase: 0.92, color: 'rgba(129, 140, 248, 0.45)', width: 1.4 },
    ];

    for (const f of filaments) {
      ctx.beginPath();
      const baseY = height * f.yBase;
      for (let x = 0; x <= width; x += 4) {
        const y =
          baseY +
          Math.sin(x * f.freq + t * f.speed + f.phase) * f.amp +
          Math.cos(x * f.freq * 0.6 + t * 0.5) * (f.amp * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = f.color;
      ctx.lineWidth = f.width;
      ctx.stroke();
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className="wc-wave-canvas" aria-hidden="true" />;
};

// ── Card Data Definition ───────────────────────────────────────────────────────

interface CardDef {
  id: string;
  icon: React.FC;
  title: string;
  description: string;
  gradientClass: string;
  route: string | null;
}

const CARDS: CardDef[] = [
  {
    id: 'workspace',
    icon: WorkspaceIcon,
    title: 'Open to Workspace',
    description: 'Access your original AETHER workspace with all existing features and familiar interface.',
    gradientClass: 'wc-card--blue',
    route: '/app',
  },
  {
    id: 'launcher',
    icon: LauncherIcon,
    title: 'Explore YOUR AETHER',
    description: 'Experience the new, futuristic app launcher with modern design and enhanced productivity tools.',
    gradientClass: 'wc-card--purple',
    route: '/app/your-aether',
  },
  {
    id: 'session',
    icon: SessionIcon,
    title: 'Continue Last Session',
    description: 'Resume your previous activity from where you left off.',
    gradientClass: 'wc-card--cyan',
    route: null,
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export const WelcomeChoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = normalizeUserProfile(user as Record<string, unknown> | null | undefined);

  // Capitalize or format first name nicely; fallback gracefully to user profile display
  const rawName = profile.firstName || profile.displayName || 'Vamsi';
  const firstName =
    rawName && rawName !== 'User'
      ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
      : 'Vamsi';

  const handleCardClick = useCallback(
    (card: CardDef) => {
      const uid = profile.id ?? 'anonymous';
      if (card.route) {
        setLastSession(uid, card.route);
        navigate(card.route);
      } else {
        const lastPath = getLastSession(uid);
        const destination = isValidDestination(lastPath) ? lastPath : '/app';
        navigate(destination);
      }
    },
    [navigate, profile.id],
  );

  return (
    <div className="wc-root" role="main">
      {/* Outer Glowing Blue Rounded Frame Surrounding the Entire Screen */}
      <div className="wc-frame" aria-hidden="true" />

      {/* Animated Ethereal Wave Background */}
      <WaveBackground />

      {/* Atmospheric Ambient Glows */}
      <div className="wc-orb wc-orb--blue" aria-hidden="true" />
      <div className="wc-orb wc-orb--purple" aria-hidden="true" />
      <div className="wc-orb wc-orb--cyan" aria-hidden="true" />

      {/* Centered Choice Container */}
      <div className="wc-content">
        {/* Trust-Based Quotations Above AETHER Logo */}
        <div className="wc-quotes" aria-label="AETHER core values">
          <p className="wc-quote-primary">
            We believe trust is earned through actions, not promises.
          </p>
          <p className="wc-quote-secondary">
            Your journey, your choices, your progress—with AETHER by your side.
          </p>
        </div>

        {/* AETHER Logo Centered at Top */}
        <div className="wc-logo-row" aria-label="AETHER logo">
          <div className="wc-logo-icon">
            <AetherSymbol size={44} idPrefix="wc" />
          </div>
          <span className="wc-logo-text">AETHER</span>
        </div>

        {/* Personalized Heading */}
        <h1 className="wc-heading">
          Welcome back, <span className="wc-name">{firstName}!</span>
        </h1>
        <p className="wc-subheading">Choose how you want to continue your AETHER journey.</p>

        {/* Three Large Interactive Cards */}
        <div className="wc-cards" role="list">
          {CARDS.map((card) => (
            <button
              key={card.id}
              id={`wc-card-${card.id}`}
              className={`wc-card ${card.gradientClass}`}
              onClick={() => handleCardClick(card)}
              role="listitem"
              aria-label={card.title}
              type="button"
            >
              <div className="wc-card__icon-wrap" aria-hidden="true">
                <card.icon />
              </div>

              <div className="wc-card__body">
                <span className="wc-card__title">{card.title}</span>
                <span className="wc-card__desc">{card.description}</span>
              </div>

              <div className="wc-card__arrow" aria-hidden="true">
                <ChevronRightIcon />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeChoicePage;
