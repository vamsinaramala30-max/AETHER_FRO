import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const TemplateSearch: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search templates by keyword, category, or workflow function..."
        className="border-slate-200/80 bg-white pl-10 pr-9 dark:border-slate-800 dark:bg-slate-900"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
