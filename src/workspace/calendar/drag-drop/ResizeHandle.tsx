import React from 'react';

interface ResizeHandleProps {
  position: 'top' | 'bottom';
  onResizeStart: (e: React.MouseEvent) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, onResizeStart }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Resize event from ${position}`}
      onMouseDown={onResizeStart}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position]: 0,
        height: '6px',
        cursor: 'ns-resize',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    />
  );
};
