'use client';
import { useEffect, useRef, useState } from 'react';
import { observeAnimationsPaused } from './motion';

/** Observe a mounted region; unsupported browsers display the meaningful state. */
export function observeInView(element: HTMLElement, update: (visible: boolean) => void, rootMargin = '120px 0px') {
  let inView = false;
  let paused = false;
  const publish = () => {
    const running = inView && !paused;
    element.classList.toggle('idle', !running);
    update(running);
  };
  const apply = (visible: boolean) => {
    inView = visible;
    publish();
  };
  const stopObservingPause = observeAnimationsPaused(value => { paused = value; publish(); });
  if (typeof IntersectionObserver === 'undefined') {
    apply(true);
    return () => { stopObservingPause(); element.classList.remove('idle'); };
  }
  apply(false);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.target === element) apply(entry.isIntersecting);
  }, { rootMargin, threshold: 0 });
  observer.observe(element);
  return () => { observer.disconnect(); stopObservingPause(); element.classList.remove('idle'); };
}

/** Attach ref to the animation region. inView is false while globally paused; gate JS timers on it. */
export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = '120px 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (ref.current) return observeInView(ref.current, setInView, rootMargin);
  }, [rootMargin]);
  return { ref, inView };
}
