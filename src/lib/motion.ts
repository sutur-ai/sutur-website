'use client';
import { useEffect, useState } from 'react';

const pauseStorageKey = 'sutur-animations-paused';
const pauseEvent = 'sutur-motion-change';
let initializedDocument: Document | undefined;
let restoreEntrances: (() => void) | undefined;

/** Hold finite animations at their final keyframe, including scroll timelines and new content. */
export function settleFiniteAnimations(root: HTMLElement) {
  const originals = new Map<Animation, { effect: KeyframeEffect; frames: Keyframe[]; fill: FillMode }>();
  const pending = new Set<Element>();
  let frame: number | undefined;
  const prune = () => {
    for (const [animation, original] of originals) {
      if (!original.effect.target?.isConnected || animation.playState === 'idle') {
        animation.removeEventListener('cancel', schedule);
        originals.delete(animation);
      }
    }
  };
  const settle = (region: Element) => {
    for (const animation of region.getAnimations({ subtree: true })) {
      if (typeof CSSTransition !== 'undefined' && animation instanceof CSSTransition) continue;
      const effect = animation.effect;
      if (!(effect instanceof KeyframeEffect) || !effect.target?.isConnected || animation.playState === 'idle' || effect.getTiming().iterations === Infinity || originals.has(animation)) continue;
      const frames = effect.getKeyframes();
      if (!frames.length) continue;
      originals.set(animation, { effect, frames, fill: effect.getTiming().fill ?? 'auto' });
      animation.addEventListener('cancel', schedule);
      const final: Keyframe = { ...frames[frames.length - 1] };
      delete final.computedOffset;
      effect.setKeyframes([{ ...final, offset: 0 }, { ...final, offset: 1 }]);
      effect.updateTiming({ fill: 'both' });
    }
  };
  const flush = () => {
    frame = undefined;
    prune();
    const regions = [...pending];
    pending.clear();
    for (const region of regions) {
      if (region.isConnected && !regions.some(parent => parent !== region && parent.contains(region))) settle(region);
    }
  };
  function schedule() {
    if (frame === undefined) frame = requestAnimationFrame(flush);
  }
  const onStart = (event: Event) => {
    if (event.target instanceof Element) pending.add(event.target);
    schedule();
  };
  // One initial page scan; subsequent passes only visit added subtrees or animation targets.
  settle(root);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) if (node instanceof Element) pending.add(node);
    }
    schedule(); // Removal-only batches still prune detached effects.
  });
  observer.observe(root, { subtree: true, childList: true });
  root.addEventListener('animationstart', onStart, { capture: true });
  return () => {
    observer.disconnect();
    root.removeEventListener('animationstart', onStart, { capture: true });
    if (frame !== undefined) cancelAnimationFrame(frame);
    pending.clear();
    prune();
    for (const [animation, original] of originals) {
      animation.removeEventListener('cancel', schedule);
      original.effect.setKeyframes(original.frames);
      original.effect.updateTiming({ fill: original.fill });
    }
    originals.clear();
  };
}

function applyAnimationsPaused(paused: boolean) {
  restoreEntrances?.();
  restoreEntrances = undefined;
  document.documentElement.classList.toggle('animations-paused', paused);
  if (paused && typeof document.documentElement.getAnimations === 'function' && typeof KeyframeEffect !== 'undefined') {
    const page = document.querySelector<HTMLElement>('.sx');
    if (page) restoreEntrances = settleFiniteAnimations(page);
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
