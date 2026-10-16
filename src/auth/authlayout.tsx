import React from 'react';
import { AetherSymbol } from '@/components/branding/AetherLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 px-6 pb-10 pt-24 text-slate-100 selection:bg-cyan-500/30 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {/* Concept 1 Official Logo */}
        <div className="flex items-center justify-center">
          <AetherSymbol size={48} />
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-center text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-2 text-center text-sm text-slate-400">{subtitle}</p>

        {/* Card */}
        <div className="mt-8 w-full rounded-2xl border border-slate-800/80 bg-slate-900/50 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
