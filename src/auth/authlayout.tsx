import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 px-6 pb-10 pt-24 text-slate-100 selection:bg-cyan-500/30 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {/* Logo */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/10">
          <span className="select-none text-xl font-bold tracking-wider text-white">Æ</span>
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
