import { useEffect, useState } from "react";

/** True after hydration — guards browser-only reads from SSR mismatch. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
