import React from 'react';
import { Input } from '../ui/Input';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear
}) => {
  return (
    <Input
      value={value}
      onChange={(e) => { onChange(e.target.value); }}
      placeholder={placeholder}
      leftIcon={<span>🔍</span>}
      rightIcon={
        value ? (
          <button onClick={onClear} className="text-text-tertiary hover:text-text-primary text-xs">
            ✕
          </button>
        ) : undefined
      }
    />
  );
};