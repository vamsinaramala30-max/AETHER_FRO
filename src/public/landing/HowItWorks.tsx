import React from 'react';
import { ListChecks, BellRing, BrainCircuit } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Capture and organize',
      description:
        'Add your daily tasks, active projects, notes, and milestones in a distraction-free personal workspace.',
      icon: ListChecks,
      accent: 'from-indigo-500 to-indigo-600',
    },
    {
      number: '02',
      title: 'Plan with adaptive reminders',
      description:
        'Let AETHER organize your daily schedule and surface timely reminders that keep your priorities on track.',
      icon: BellRing,
      accent: 'from-purple-500 to-indigo-500',
    },
    {
      number: '03',
      title: 'Practice problem-solving',
      description:
        'Use the cognitive hub to work through real challenges from your tasks and build stronger reasoning habits.',
      icon: BrainCircuit,
      accent: 'from-cyan-500 to-indigo-500',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-zinc-800/40 bg-zinc-950/20 py-16 backdrop-blur-md sm:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300 backdrop-blur-md">
            Simple Workflow
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl"
          >
            How it works
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Get started in minutes and build daily momentum in three clear steps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/70 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400 sm:text-sm">
                      Step {step.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-indigo-400 shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm sm:leading-6">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
