'use client';
import { useEffect, useState } from 'react';

export function bookingReached(top: number, viewportHeight: number) {
  return top < viewportHeight;
}
export function FloatingCta() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const book = document.getElementById('book');
    if (!book) return;
    const update = () => setHidden(bookingReached(book.getBoundingClientRect().top, window.innerHeight));
    update();
    const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(update, { threshold: 0 });
    observer?.observe(book);
    // Also covers loading a deep anchor and jumping past the section into the footer.
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { observer?.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <a className={`fab${hidden ? ' off' : ''}`} href="#book" aria-hidden={hidden} tabIndex={hidden ? -1 : 0}>Book a demo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>;
}
