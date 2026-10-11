'use client';
import { useEffect, useState } from 'react';

export function observeReducedMotion(update: (reduced: boolean) => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    update(true);
    return () => {};
  }
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const change = () => update(query.matches);
  change();
  if (query.addEventListener) query.addEventListener('change', change);
  else query.addListener(change);
  return () => {
    if (query.removeEventListener) query.removeEventListener('change', change);
    else query.removeListener(change);
  };
}

/** Starts paused during SSR/hydration; animation callers can show their final state. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => observeReducedMotion(setReduced), []);
  return reduced;
}
