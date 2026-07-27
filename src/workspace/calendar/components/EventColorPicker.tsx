import React from 'react';
import { DEFAULT_EVENT_COLORS } from '../utils/constants';

interface EventColorPickerProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

export const EventColorPicker: React.FC<EventColorPickerProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '8px 0' }}>
      {DEFAULT_EVENT_COLORS.map((c) => (
        <button
          key={c.hex}
          type="button"
          aria-label={c.name}
          title={c.name}
          onClick={() => {
            onSelectColor(c.hex);
          }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: c.hex,
            border: selectedColor === c.hex ? '2px solid #000000' : 'none',
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
};
