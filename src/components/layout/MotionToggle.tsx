'use client';
import { setAnimationsPaused, useAnimationsPaused } from '../../lib/motion';

export function MotionToggle() {
  const paused = useAnimationsPaused();
  return <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setAnimationsPaused(!paused)}>
    {paused ? 'Play animations' : 'Pause animations'}
  </button>;
}
