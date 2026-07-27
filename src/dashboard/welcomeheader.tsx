import React, { useState, useEffect } from 'react';

interface WelcomeHeaderProps {
  user?: {
    name?: string;
    email?: string;
  } | null;
  isLoadingUser?: boolean;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  user = null,
  isLoadingUser = false,
}) => {
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
      }),
    );
  }, []);

  if (isLoadingUser) {
    return <div className="h-12 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />;
  }

  const hasName = user !== null && typeof user.name === 'string' && user.name.trim() !== '';
  const hasEmail = user !== null && typeof user.email === 'string' && user.email.trim() !== '';
  const displayName = hasName
    ? (user.name as string)
    : hasEmail
      ? ((user.email as string).split('@')[0] ?? 'Aether Operator')
      : 'Aether Operator';

  return (
    <header className="flex flex-col gap-2 border-b border-slate-200/60 bg-transparent pb-6 md:flex-row md:items-center md:justify-between dark:border-slate-800/60">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-200 md:text-3xl dark:text-white">
          {greeting}, <span className="text-primary-600 dark:text-primary-400">{displayName}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Systems initialized. Ready to orchestrate workspace execution paths.
        </p>
      </div>
      <div className="self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 md:self-center md:text-sm dark:bg-slate-800 dark:text-slate-300">
        {formattedDate}
      </div>
    </header>
  );
};

export default WelcomeHeader;
