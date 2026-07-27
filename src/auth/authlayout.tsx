// frontend/src/auth/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-950 px-6 py-12 text-slate-100 selection:bg-cyan-500/30 lg:px-8">
      <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Icon Boundary */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/10 transition-transform duration-200 active:scale-95">
          <span className="select-none text-xl font-bold tracking-wider text-white">Æ</span>
        </div>
        <h2 className="mt-6 text-center font-sans text-3xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
