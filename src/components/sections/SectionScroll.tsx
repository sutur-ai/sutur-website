'use client';

import { useEffect, useState } from 'react';

const TRANSITION_MS = 760;
const GESTURE_QUIET_MS = 180;

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function SectionScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 901px)');
    let animationRunning = false;
    let gestureQuiet = true;
    let targetIndex = 0;
    let animationFrame = 0;
    let quietTimer = 0;

    const targets = () =>
      Array.from(document.querySelectorAll<HTMLElement>('.scroll-section'));

    const targetTop = (element: HTMLElement, index: number) =>
      index === 0 ? 0 : element.offsetTop;

    const updateActiveSection = () => {
      const sections = targets();
      const positions = sections.map(targetTop);
      const current = positions.reduce(
        (closest, position, index) =>
          Math.abs(position - window.scrollY) <
          Math.abs(positions[closest] - window.scrollY)
            ? index
            : closest,
        0,
      );
      setSectionCount(sections.length);
      setActiveIndex(current);
      if (!animationRunning) targetIndex = current;
    };

    const waitForQuiet = () => {
      gestureQuiet = false;
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(() => {
        gestureQuiet = true;
      }, GESTURE_QUIET_MS);
    };

    const animateTo = (destination: number) => {
      const start = window.scrollY;
      const distance = destination - start;
      const startedAt = performance.now();
      animationRunning = true;
      document.documentElement.classList.add('is-section-animating');

      const frame = (now: number) => {
        const progress = Math.min((now - startedAt) / TRANSITION_MS, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(frame);
          return;
        }

        window.scrollTo(0, destination);
        animationRunning = false;
        document.documentElement.classList.remove('is-section-animating');
      };

      animationFrame = requestAnimationFrame(frame);
    };

    const onWheel = (event: WheelEvent) => {
      if (
        !desktop.matches ||
        reducedMotion.matches ||
        document.querySelector('.modal-backdrop') ||
        Math.abs(event.deltaY) < 2 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }

      event.preventDefault();
      const isNewGesture = gestureQuiet;
      waitForQuiet();
      if (!isNewGesture) return;

      const sections = targets();
      if (!sections.length) return;

      const positions = sections.map(targetTop);
      const current = animationRunning
        ? targetIndex
        : positions.reduce(
            (closest, position, index) =>
              Math.abs(position - window.scrollY) <
              Math.abs(positions[closest] - window.scrollY)
                ? index
                : closest,
            0,
          );
      const direction = event.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(current + direction, sections.length - 1));

      if (next === current) return;
      targetIndex = next;
      if (animationRunning) window.cancelAnimationFrame(animationFrame);
      animateTo(positions[next]);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('wheel', onWheel);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(quietTimer);
      document.documentElement.classList.remove('is-section-animating');
    };
  }, []);

  const move = (direction: -1 | 1) => {
    window.dispatchEvent(
      new WheelEvent('wheel', {
        deltaY: direction * 100,
        cancelable: true,
      }),
    );
  };

  return (
    <>
      {activeIndex > 0 && (
        <button
          className="section-cue section-cue-up"
          type="button"
          aria-label="Previous section"
          onClick={() => move(-1)}
        >
          <svg aria-hidden="true" viewBox="0 0 20 12">
            <path d="M2 10 10 2l8 8" />
          </svg>
          <span className="section-cue-line" aria-hidden="true" />
          <small>Previous</small>
        </button>
      )}
      {activeIndex < sectionCount - 1 && (
        <button
          className="section-cue section-cue-down"
          type="button"
          aria-label="Next section"
          onClick={() => move(1)}
        >
          <small>Explore</small>
          <span className="section-cue-line" aria-hidden="true" />
          <svg aria-hidden="true" viewBox="0 0 20 12">
            <path d="m2 2 8 8 8-8" />
          </svg>
        </button>
      )}
    </>
  );
}
