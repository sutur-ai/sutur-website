'use client';
import { useEffect, useRef, useState } from 'react';

/** Observe a mounted region; unsupported browsers display the meaningful state. */
export function observeInView(element: HTMLElement, update: (visible: boolean) => void, rootMargin = '120px 0px') {
  const apply = (visible: boolean) => {
    element.classList.toggle('idle', !visible);
    update(visible);
  };
  if (typeof IntersectionObserver === 'undefined') {
    apply(true);
    return () => { element.classList.remove('idle'); };
  }
  apply(false);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.target === element) apply(entry.isIntersecting);
  }, { rootMargin, threshold: 0 });
  observer.observe(element);
  return () => { observer.disconnect(); element.classList.remove('idle'); };
}

/** Attach ref to the animation region. JS timers should run only when inView is true. */
export function useInView<T extends HTMLElement = HTMLDivElement>(rootMargin = '120px 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (ref.current) return observeInView(ref.current, setInView, rootMargin);
  }, [rootMargin]);
  return { ref, inView };
}
