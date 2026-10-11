import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MotionToggle } from '../src/components/layout/MotionToggle';

const motion = vi.hoisted(() => ({ paused: false, setPaused: vi.fn() }));
vi.mock('../src/lib/motion', () => ({ useAnimationsPaused: () => motion.paused, setAnimationsPaused: motion.setPaused }));
vi.stubGlobal('React', React);
afterEach(() => { motion.paused = false; vi.clearAllMocks(); });

describe('motion toggle', () => {
  it('labels both states and toggles the shared preference', () => {
    for (const paused of [false, true]) {
      motion.paused = paused;
      const button = MotionToggle();
      const markup = renderToStaticMarkup(button);
      expect(markup).toContain(`aria-pressed="${paused}"`);
      expect(markup).toContain(paused ? 'Play animations' : 'Pause animations');
      expect(markup).toContain('type="button"');
      button.props.onClick();
      expect(motion.setPaused).toHaveBeenLastCalledWith(!paused);
    }
  });
});
