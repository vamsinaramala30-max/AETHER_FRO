import React from 'react';
import { Calendar, CheckSquare, Brain, Clock, FolderKanban, Sparkles } from 'lucide-react';

export const FeatureBlocks: React.FC = () => {
  const features = [
    {
      title: 'Smart planner and reminders',
      description:
        'Plan your day with an adaptive daily schedule and timely smart reminders that learn your habits and keep your priorities front and center.',
      icon: Clock,
      secondaryIcon: Calendar,
      badge: 'Daily Planner',
      badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    },
    {
      title: 'Projects and tasks in one workspace',
      description:
        'Bring tasks, milestones, project boards, calendar items, and notes together into a unified personal workspace designed for clear, distraction-free execution.',
      icon: FolderKanban,
      secondaryIcon: CheckSquare,
      badge: 'Unified Workspace',
      badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    },
    {
      title: 'Cognitive hub built from your real tasks',
      description:
        'Practice structured problem-solving and sharpen your thinking habits by working through interactive exercises created directly from your actual ongoing work.',
      icon: Brain,
      secondaryIcon: Sparkles,
      badge: 'Cognitive Hub',
      badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/40 py-16 backdrop-blur-md sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Core Capabilities
          </span>
          <h2
            id="features-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl"
          >
            Built for focus, planning, and practical thinking
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Everything in AETHER connects your daily workflow with structured problem-solving
            habits.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const SecondaryIcon = feature.secondaryIcon;
            return (
              <article
                key={feature.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/80 sm:p-8"
              >
                {/* Glow accent */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-sm transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-300">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${feature.badgeColor}`}
                    >
                      <SecondaryIcon className="h-3 w-3" aria-hidden="true" />
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm sm:leading-6">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
