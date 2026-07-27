import { useEffect } from 'react';

export interface ShortcutMapping {
  key: string; // e.g., 'd', 'w', 'm', 'z'
  ctrlKey?: boolean;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutMapping[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events when typing inside inputs or textareas
      const targetTag = (event.target as HTMLElement | null)?.tagName;
      if (typeof targetTag === 'string' && ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag))
        return;

      shortcuts.forEach((sc) => {
        const matchesKey = event.key.toLowerCase() === sc.key.toLowerCase();
        const matchesCtrl = sc.ctrlKey === true ? event.ctrlKey || event.metaKey : true;

        if (matchesKey && matchesCtrl) {
          event.preventDefault();
          sc.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
