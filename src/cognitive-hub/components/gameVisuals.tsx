import React from 'react';

export type VisualShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'pentagon';
export type VisualColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan';
export type VisualSize = 'sm' | 'md' | 'lg';

export interface SemanticColorToken {
  name: string;
  fill: string;
  stroke: string;
  bgLight: string;
  textDark: string;
  borderLight: string;
  ring: string;
}

export const GAME_COLORS: Record<VisualColor, SemanticColorToken> = {
  blue: {
    name: 'Blue',
    fill: '#2563EB',
    stroke: '#1D4ED8',
    bgLight: '#EFF6FF',
    textDark: '#1E40AF',
    borderLight: '#BFDBFE',
    ring: 'rgba(37, 99, 235, 0.4)',
  },
  red: {
    name: 'Red',
    fill: '#DC2626',
    stroke: '#B91C1C',
    bgLight: '#FEF2F2',
    textDark: '#991B1B',
    borderLight: '#FECACA',
    ring: 'rgba(220, 38, 38, 0.4)',
  },
  green: {
    name: 'Green',
    fill: '#16A34A',
    stroke: '#15803D',
    bgLight: '#F0FDF4',
    textDark: '#166534',
    borderLight: '#BBF7D0',
    ring: 'rgba(22, 163, 74, 0.4)',
  },
  yellow: {
    name: 'Yellow',
    fill: '#EAB308',
    stroke: '#B45309', // Darker amber stroke so it is always crisp on white
    bgLight: '#FEFCE8',
    textDark: '#854D0E',
    borderLight: '#FDE047',
    ring: 'rgba(234, 179, 8, 0.4)',
  },
  purple: {
    name: 'Purple',
    fill: '#7C3AED',
    stroke: '#6D28D9',
    bgLight: '#FAF5FF',
    textDark: '#5B21B6',
    borderLight: '#E9D5FF',
    ring: 'rgba(124, 58, 237, 0.4)',
  },
  orange: {
    name: 'Orange',
    fill: '#EA580C',
    stroke: '#C2410C',
    bgLight: '#FFF7ED',
    textDark: '#9A3412',
    borderLight: '#FED7AA',
    ring: 'rgba(234, 88, 12, 0.4)',
  },
  pink: {
    name: 'Pink',
    fill: '#DB2777',
    stroke: '#BE185D',
    bgLight: '#FDF2F8',
    textDark: '#9D174D',
    borderLight: '#FBCFE8',
    ring: 'rgba(219, 39, 119, 0.4)',
  },
  cyan: {
    name: 'Cyan',
    fill: '#0891B2',
    stroke: '#0E7490',
    bgLight: '#ECFEFF',
    textDark: '#155E75',
    borderLight: '#A5F3FC',
    ring: 'rgba(8, 145, 178, 0.4)',
  },
};

export function getGameColor(colorKey: string): SemanticColorToken {
  const normalized = colorKey.toLowerCase() as VisualColor;
  return GAME_COLORS[normalized] ?? GAME_COLORS.blue;
}

const SIZE_PX: Record<VisualSize, number> = {
  sm: 22,
  md: 32,
  lg: 44,
};

export interface ShapeIconProps {
  shape: VisualShape | string;
  color?: VisualColor | string;
  size?: VisualSize | number;
  className?: string;
  showLabel?: boolean;
  borderStrokeWidth?: number;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({
  shape,
  color = 'blue',
  size = 'md',
  className = '',
  showLabel = false,
  borderStrokeWidth = 2,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_PX[size] || 32;
  const colorToken = getGameColor(color);
  const normalizedShape = (shape.toLowerCase() as VisualShape) || 'circle';

  const half = 50;
  const strokeW = borderStrokeWidth * (100 / pixelSize);

  const renderShapeElement = () => {
    switch (normalizedShape) {
      case 'circle':
        return (
          <circle
            cx={half}
            cy={half}
            r={44 - strokeW / 2}
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      case 'square':
        return (
          <rect
            x={10 + strokeW / 2}
            y={10 + strokeW / 2}
            width={80 - strokeW}
            height={80 - strokeW}
            rx={8}
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      case 'triangle':
        return (
          <polygon
            points={`50,${10 + strokeW / 2} ${90 - strokeW / 2},${90 - strokeW / 2} ${10 + strokeW / 2},${90 - strokeW / 2}`}
            strokeLinejoin="round"
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      case 'diamond':
        return (
          <polygon
            points={`50,${8 + strokeW / 2} ${92 - strokeW / 2},50 50,${92 - strokeW / 2} ${8 + strokeW / 2},50`}
            strokeLinejoin="round"
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      case 'star': {
        // 5-pointed star coordinates in 0-100 viewBox
        const starPoints = '50,8 62,35 92,37 68,56 76,86 50,69 24,86 32,56 8,37 38,35';
        return (
          <polygon
            points={starPoints}
            strokeLinejoin="round"
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      }
      case 'pentagon': {
        // Regular pentagon coordinates
        const pentagonPoints = '50,10 90,40 75,88 25,88 10,40';
        return (
          <polygon
            points={pentagonPoints}
            strokeLinejoin="round"
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
      }
      default:
        return (
          <circle
            cx={half}
            cy={half}
            r={44 - strokeW / 2}
            fill={colorToken.fill}
            stroke={colorToken.stroke}
            strokeWidth={strokeW}
          />
        );
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 flex-shrink-0 ${className}`}
      title={`${colorToken.name} ${normalizedShape}`}
      aria-label={`${colorToken.name} ${normalizedShape}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={pixelSize}
        height={pixelSize}
        className="overflow-visible drop-shadow-sm transition-transform duration-150"
      >
        {renderShapeElement()}
      </svg>
      {showLabel && (
        <span className="text-xs font-semibold capitalize tracking-wide" style={{ color: colorToken.textDark }}>
          {colorToken.name} {normalizedShape}
        </span>
      )}
    </span>
  );
};
