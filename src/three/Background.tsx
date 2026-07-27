import React from 'react';
import { THREE_DEFAULTS } from './constants';

export interface BackgroundProps {
  color?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  color = THREE_DEFAULTS.colors.background,
}) => {
  return <color attach="background" args={[color]} />;
};
