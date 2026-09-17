import React from 'react';

interface Props {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'sky' | 'rose' | 'slate' | 'indigo';
  className?: string;
}

export const AutomationBadge: React.FC<Props> = ({
  children,
  variant = 'slate',
  className = '',
}) => {
  const styles: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${styles[variant] || styles.slate} ${className}`}
    >
      {children}
    </span>
  );
};
