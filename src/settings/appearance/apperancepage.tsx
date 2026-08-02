import React from 'react';
import { ThemeSelector } from './themeselector';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Palette } from 'lucide-react';

export const AppearancePage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Appearance & Theme
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure interface mode, color schemes, and visual accessibility tokens.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme Selection</h3>
          <ThemeSelector />
        </div>
      </div>
    </PageWrapper>
  );
};
