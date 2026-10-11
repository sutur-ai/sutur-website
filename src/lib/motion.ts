'use client';
import { useEffect, useState } from 'react';

const pauseStorageKey = 'sutur-animations-paused';
const pauseEvent = 'sutur-motion-change';
let initializedDocument: Document | undefined;
let restoreEntrances: (() => void) | undefined;

/** Hold finite animations at their final keyframe, including scroll timelines and new content. */
export function settleFiniteAnimations(root: HTMLElement) {
  const originals = new Map<KeyframeEffect, { frames: Keyframe[]; fill: FillMode }>();
  const settle = () => {
    for (const animation of root.getAnimations({ subtree: true })) {
      if (typeof CSSTransition !== 'undefined' && animation instanceof CSSTransition) continue;
      const effect = animation.effect;
      if (!(effect instanceof KeyframeEffect) || effect.getTiming().iterations === Infinity || originals.has(effect)) continue;
      const frames = effect.getKeyframes();
      if (!frames.length) continue;
      originals.set(effect, { frames, fill: effect.getTiming().fill ?? 'auto' });
      const final: Keyframe = { ...frames[frames.length - 1] };
      delete final.computedOffset;
      effect.setKeyframes([{ ...final, offset: 0 }, { ...final, offset: 1 }]);
      effect.updateTiming({ fill: 'both' });
    }
  };
  settle();
  const observer = new MutationObserver(settle);
  observer.observe(root, { subtree: true, childList: true, attributes: true });
  root.addEventListener('animationstart', settle, { capture: true });
  window.addEventListener('resize', settle);
  return () => {
    observer.disconnect();
    root.removeEventListener('animationstart', settle, { capture: true });
    window.removeEventListener('resize', settle);
    for (const [effect, original] of originals) {
      effect.setKeyframes(original.frames);
      effect.updateTiming({ fill: original.fill });
    }
  };
}

function applyAnimationsPaused(paused: boolean) {
  restoreEntrances?.();
  restoreEntrances = undefined;
  document.documentElement.classList.toggle('animations-paused', paused);
  if (paused && typeof document.documentElement.getAnimations === 'function' && typeof KeyframeEffect !== 'undefined') {
    restoreEntrances = settleFiniteAnimations(document.documentElement);
  }
}

function initializeAnimationsPaused() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  if (initializedDocument === document) return;
  initializedDocument = document;
  let paused = false;
  try { paused = window.localStorage.getItem(pauseStorageKey) === 'true'; } catch {}
  applyAnimationsPaused(paused);
}

/** The viewer's choice is independent of reduced motion and region visibility. */
export function setAnimationsPaused(paused: boolean) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  initializeAnimationsPaused();
  applyAnimationsPaused(paused);
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
