import React from 'react';

export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  brand: React.ReactNode;
  links: NavbarLink[];
  actions?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ brand, links, actions }) => {
  return (
    <nav className="border-border-subtle bg-surface-base/90 flex h-16 w-full items-center justify-between border-b px-8 backdrop-blur-lg">
      <div className="flex items-center space-x-8">
        <div>{brand}</div>
        <div className="flex space-x-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                link.active
                  ? 'text-accent-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {actions && <div className="flex items-center space-x-4">{actions}</div>}
    </nav>
  );
};
