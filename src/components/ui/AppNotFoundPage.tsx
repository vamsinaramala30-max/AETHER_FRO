import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const AppNotFoundPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="max-w-sm space-y-6 text-center">
          <div className="text-7xl font-black leading-none text-slate-700 dark:text-slate-800">
            404
          </div>
          <div>
            <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              Page not found
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This page doesn't exist in your workspace. It may have been moved or deleted.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/app"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <Home className="h-3.5 w-3.5" />
              Go to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => history.back()}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-500 dark:border-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AppNotFoundPage;
