'use client';
import { useEffect, useState } from 'react';

const pauseStorageKey = 'sutur-animations-paused';
const pauseEvent = 'sutur-motion-change';
let initializedDocument: Document | undefined;

function initializeAnimationsPaused() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (initializedDocument === document) return;
  initializedDocument = document;
  let paused = false;
  try { paused = window.localStorage.getItem(pauseStorageKey) === 'true'; } catch {}
  document.documentElement.classList.toggle('animations-paused', paused);
}

/** The viewer's choice is independent of reduced motion and region visibility. */
export function setAnimationsPaused(paused: boolean) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  initializeAnimationsPaused();
  document.documentElement.classList.toggle('animations-paused', paused);
  try { window.localStorage.setItem(pauseStorageKey, String(paused)); } catch {}
  window.dispatchEvent(new Event(pauseEvent));
}

export function observeAnimationsPaused(update: (paused: boolean) => void) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    update(false);
    return () => {};
  }
  initializeAnimationsPaused();
  const change = () => update(document.documentElement.classList.contains('animations-paused'));
  window.addEventListener(pauseEvent, change);
  change();
  return () => window.removeEventListener(pauseEvent, change);
}

export function useAnimationsPaused() {
  const [paused, setPaused] = useState(false);
  useEffect(() => observeAnimationsPaused(setPaused), []);
  return paused;
}

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
