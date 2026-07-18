'use client';

import { useEffect, useRef } from 'react';
import { process } from '@/content/process';

export function ProcessTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      timeline.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timeline.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(timeline);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={timelineRef}
      className="timeline timeline-reveal"
      role="list"
      aria-label="Our process timeline"
    >
      {process.map(([n, title, description]) => (
        <article className="timeline-step" role="listitem" key={n}>
          <div className="timeline-marker" aria-hidden="true">
            <span>{n}</span>
          </div>
          <div className="timeline-copy">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
