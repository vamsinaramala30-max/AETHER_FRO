// Event bus for cross-AETHER live data updates across pages
type ActivityListener = () => void;

const listeners = new Set<ActivityListener>();

export const onActivityUpdate = (listener: ActivityListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const triggerActivityUpdate = (): void => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error executing activity listener:', e);
    }
  });
};
