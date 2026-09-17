import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-aether-border bg-aether-surface-elevated">
          <Icon className="h-7 w-7 text-aether-muted" />
        </div>
      )}
      <h3 className="mb-1 text-sm font-semibold text-aether-main">{title}</h3>
      {description && (
        <p className="max-w-xs text-xs leading-relaxed text-aether-muted">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
