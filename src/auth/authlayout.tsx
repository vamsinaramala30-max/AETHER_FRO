// frontend/src/auth/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 px-6 py-12 lg:px-8 text-slate-100 selection:bg-cyan-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Logo Icon Boundary */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10 active:scale-95 transition-transform duration-200">
          <span className="font-bold text-xl tracking-wider text-white select-none">Æ</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-sans">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 px-6 py-8 shadow-2xl rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};