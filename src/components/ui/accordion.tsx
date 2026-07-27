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
    <div className="border-border-subtle bg-surface-subtle space-y-2 rounded-xl border p-2">
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        return (
          <div
            key={item.id}
            className="border-border-subtle bg-surface-base overflow-hidden rounded-lg border"
          >
            <button
              onClick={() => {
                toggle(item.id);
              }}
              className="text-text-primary hover:bg-surface-hover flex w-full items-center justify-between p-4 text-left text-sm font-medium transition-colors"
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
                  <div className="text-text-secondary border-border-subtle/50 mt-1 border-t p-4 pt-0 text-xs">
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
