import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  useGradient?: boolean;
  className?: string;
}

const DEFAULT_SIZE = 24;

const createAetherIcon = (
  iconName: string,
  pathContent: React.ReactNode
): React.FC<IconProps> => {
  const IconComponent: React.FC<IconProps> = ({
    size = DEFAULT_SIZE,
    useGradient = false,
    className = '',
    style,
    ...props
  }) => {
    const strokeColor = useGradient ? 'url(#aether-brand-gradient)' : 'currentColor';

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`aether-icon aether-icon-${iconName} ${className}`}
        style={style}
        {...props}
      >
        <defs>
          <linearGradient id="aether-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {pathContent}
      </svg>
    );
  };

  IconComponent.displayName = `AetherIcon(${iconName})`;
  return IconComponent;
};

// Navigation Icons
export const DashboardIcon = createAetherIcon('dashboard', (
  <>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </>
));

export const AiIcon = createAetherIcon('ai', (
  <>
    <path d="M12 2C12 7 7 12 2 12C7 12 12 17 12 22C12 17 17 12 22 12C17 12 12 7 12 2Z" />
    <path d="M18 3C18 5.5 16 7.5 13.5 7.5C16 7.5 18 9.5 18 12C18 9.5 20 7.5 22.5 7.5C20 7.5 18 5.5 18 3Z" strokeWidth="1.25" />
  </>
));

export const ProjectsIcon = createAetherIcon('projects', (
  <>
    <path d="M3 7B2 2 0 0 1 5 5H19B2 2 0 0 1 21 7V17B2 2 0 0 1 19 19H5B2 2 0 0 1 3 17Z" />
    <path d="M3 10H21" />
    <path d="M8 5V21" />
  </>
));

export const KnowledgeIcon = createAetherIcon('knowledge', (
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
    <circle cx="12" cy="9" r="2" />
    <path d="M12 11V15" />
  </>
));

export const AutomationIcon = createAetherIcon('automation', (
  <>
    <rect x="3" y="4" width="6" height="6" rx="2" />
    <rect x="15" y="4" width="6" height="6" rx="2" />
    <rect x="9" y="14" width="6" height="6" rx="2" />
    <path d="M9 7H15" />
    <path d="M6 10V17H9" />
    <path d="M18 10V17H15" />
  </>
));

export const WorkspaceIcon = createAetherIcon('workspace', (
  <>
    <path d="M4 4H20V20H4Z" rx="2" />
    <path d="M9 4V20" />
    <path d="M14 4V20" />
    <path d="M4 9H20" />
    <path d="M4 14H20" />
  </>
));

export const SettingsIcon = createAetherIcon('settings', (
  <>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" fill="currentColor" />
    <circle cx="16" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
  </>
));

export const ProfileIcon = createAetherIcon('profile', (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21V19A4 4 0 0 1 10 15H14A4 4 0 0 1 18 19V21" />
  </>
));

export const NotificationsIcon = createAetherIcon('notifications', (
  <>
    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8" />
    <path d="M13.73 21A2 2 0 0 1 10.27 21" />
    <circle cx="18" cy="5" r="3" fill="#22D3EE" stroke="none" />
  </>
));

export const SearchIcon = createAetherIcon('search', (
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21L16.65 16.65" />
  </>
));

export const MenuIcon = createAetherIcon('menu', (
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
));

export const CloseIcon = createAetherIcon('close', (
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
));

export const BackIcon = createAetherIcon('back', (
  <>
    <path d="M15 18L9 12L15 6" />
  </>
));

export const NextIcon = createAetherIcon('next', (
  <>
    <path d="M9 18L15 12L9 6" />
  </>
));