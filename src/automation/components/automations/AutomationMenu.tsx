import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Play, Pause, Copy, Activity, Trash2 } from 'lucide-react';
import { AutomationRule } from '../../automation-types';

interface Props {
  rule: AutomationRule;
  onEdit?: (rule: AutomationRule) => void;
  onToggleStatus: (rule: AutomationRule) => void;
  onRunNow: (id: string) => void;
  onDuplicate: (rule: AutomationRule) => void;
  onViewActivity: (ruleId: string) => void;
  onDelete: (id: string) => void;
}

export const AutomationMenu: React.FC<Props> = ({
  rule,
  onEdit,
  onToggleStatus,
  onRunNow,
  onDuplicate,
  onViewActivity,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="animate-in fade-in-50 zoom-in-95 absolute right-0 z-20 mt-1 w-48 rounded-xl border border-slate-200/80 bg-white py-1.5 shadow-xl duration-100 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => {
              setIsOpen(false);
              onRunNow(rule.id);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Play className="h-3.5 w-3.5 text-amber-500" />
            Run Now
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleStatus(rule);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pause className="h-3.5 w-3.5 text-slate-400" />
            {rule.status === 'active' ? 'Pause Automation' : 'Resume Automation'}
          </button>

          {onEdit && (
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit(rule);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-400" />
              Edit Workflow
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              onDuplicate(rule);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            Duplicate
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onViewActivity(rule.id);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Activity className="h-3.5 w-3.5 text-slate-400" />
            View Execution History
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(rule.id);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Automation
          </button>
        </div>
      )}
    </div>
  );
};
