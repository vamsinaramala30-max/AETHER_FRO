import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setExpanded((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setExpanded((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-subtle p-2">
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-border-subtle bg-surface-base"
          >
            <button
              onClick={() => {
                toggle(item.id);
              }}
              className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover"
            >
              <span>{item.title}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-border-subtle/50 mt-1 border-t p-4 pt-0 text-xs text-text-secondary">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
