import React, { useState, useEffect } from 'react';

interface WelcomeHeaderProps {
  user?: {
    name?: string;
    email?: string;
  } | null;
  isLoadingUser?: boolean;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user, isLoadingUser }) => {
  const [greeting, setGreeting] = useState<string>('Welcome');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setFormattedDate(
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  if (isLoadingUser) {
    return <div className="h-12 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />;
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Aether Operator';

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-6 bg-transparent">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">
          {greeting}, <span className="text-primary-600 dark:text-primary-400">{displayName}</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Systems initialized. Ready to orchestrate workspace execution paths.
        </p>
      </div>
      <div className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-center transition-all duration-200">
        {formattedDate}
      </div>
    </header>
  );
};

export default WelcomeHeader;