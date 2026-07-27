import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-text-tertiary flex items-center space-x-2 text-xs">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span>/</span>}
            {isLast || !item.href ? (
              <span className="text-text-primary font-semibold">{item.label}</span>
            ) : (
              <button
                onClick={() => onNavigate && item.href && onNavigate(item.href)}
                className="hover:text-text-secondary transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
