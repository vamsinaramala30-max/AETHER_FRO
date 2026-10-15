import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useauth';
import { ProductPreview } from './ProductPreview';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Brain,
  FolderKanban,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section
      className="relative overflow-hidden border-b border-zinc-800/40 bg-transparent pb-12 pt-6 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16"
      aria-labelledby="hero-heading"
    >
      {/* Background Gradient Mesh & Ambient Spotlights */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-4 top-1/4 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl sm:left-10 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute right-4 top-1/3 h-60 w-60 rounded-full bg-cyan-600/10 blur-3xl sm:right-10 sm:h-80 sm:w-80" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start space-y-4 text-left sm:space-y-6 lg:col-span-7">
            {/* Announcement Badge */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
              <span className="truncate">AI-Powered Personal Workspace • Free during beta</span>
            </div>

            {/* High-Impact Headline (Single h1 for the page) */}
            <h1
              id="hero-heading"
              className="text-2xl font-bold leading-[1.15] tracking-tight text-zinc-100 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Your AI workspace that plans your day and{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                sharpens how you think.
              </span>
            </h1>

            {/* One-Sentence Subheading */}
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base lg:text-lg">
              Plan your day, manage projects and get smart reminders. AETHER&apos;s AI learns how you
              work and helps you think through real problems.
            </p>

            {/* Actions Segment */}
            <div className="w-full pt-1 sm:pt-2">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  to={isAuthenticated ? '/welcome' : '/signup'}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-[#0B0D12]"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Product Pillar Badges */}
            <div className="flex w-full max-w-xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-800/80 pt-4 text-xs text-zinc-400 sm:pt-5">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400 sm:h-4 sm:w-4" aria-hidden="true" />
                Smart Planner & Reminders
              </span>
              <span className="flex items-center gap-1.5">
                <FolderKanban className="h-3.5 w-3.5 text-cyan-400 sm:h-4 sm:w-4" aria-hidden="true" />
                Projects & Tasks
              </span>
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-purple-400 sm:h-4 sm:w-4" aria-hidden="true" />
                Cognitive Hub Practice
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Interactive Showcase */}
          <div className="mt-4 w-full sm:mt-0 lg:col-span-5">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
