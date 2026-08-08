import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useauth';
import { ProductPreview } from './ProductPreview';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  Bot,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const userName = user?.name || (user?.email ? user.email.split('@')[0] : null) || 'Architect';

  return (
    <section
      className="relative overflow-hidden border-b border-zinc-800/50 bg-[#0B0D12] pt-6 sm:pt-12 lg:pt-16 pb-12 sm:pb-20 lg:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* Background Gradient Mesh & Spotlights */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-4 sm:left-10 top-1/4 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute right-4 sm:right-10 top-1/3 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-cyan-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2-Column Responsive Layout: Left 55%, Right 45% */}
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & Actions (55% / 7 cols on lg) */}
          <div className="flex flex-col items-start space-y-4 sm:space-y-6 text-left lg:col-span-7">
            {/* Enterprise Announcement Badge */}
            {isAuthenticated ? (
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                <span className="truncate">Active Session • Ready to Launch</span>
              </div>
            ) : (
              <Link
                to="/signup"
                className="group inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-sm transition-all hover:border-zinc-700"
              >
                <span className="flex shrink-0 items-center gap-1 font-semibold text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  AETHER 2.0
                </span>
                <span className="text-zinc-500">|</span>
                <span className="truncate text-zinc-300 transition-colors group-hover:text-zinc-100">
                  Cognitive OS & Local Intelligence
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            {/* High-Impact Headline */}
            <h1
              id="hero-heading"
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-zinc-100"
            >
              {isAuthenticated ? (
                <>
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text capitalize text-transparent">
                    {userName}
                  </span>
                  .
                </>
              ) : (
                <>
                  A unified layer for personal{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                    intelligence, structure, and focus.
                  </span>
                </>
              )}
            </h1>

            {/* Subheadline Description */}
            <p className="max-w-xl text-xs sm:text-base lg:text-lg leading-relaxed text-zinc-400">
              {isAuthenticated
                ? 'Your cognitive memory graph and local vector indexes are active. Access your workspace, review recent sprint tasks, or interact with AI assistant.'
                : 'Aether orchestrates tasks, durable knowledge, cognitive memory support, and custom contextual automation. Engineered for maximum speed and zero cloud data leaks.'}
            </p>

            {/* Actions Segment */}
            <div className="w-full pt-1 sm:pt-2">
              {isAuthenticated ? (
                <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Open Workspace
                  </Link>

                  <Link
                    to="/app/chat"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  >
                    <Bot className="h-4 w-4 text-indigo-400" />
                    AI Assistant
                  </Link>

                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200 sm:px-3 sm:py-3.5"
                  >
                    <Clock className="h-4 w-4" />
                    Continue Last Session
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-zinc-100/10 transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>

            {/* Trust Indicators below CTAs */}
            <div className="flex w-full max-w-xl flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-900/80 pt-3 sm:gap-x-6 sm:pt-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
                Local-first Security
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 sm:h-4 sm:w-4" />
                Zero Data Mining
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 sm:h-4 sm:w-4" />
                Instant Setup
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Showcase (45% / 5 cols on lg) */}
          <div className="mt-4 w-full sm:mt-0 lg:col-span-5">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
