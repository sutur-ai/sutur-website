import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '../src/components/hero/Hero';
import { SX_SCEN, type HeroScenarioId } from '../src/content/heroScenarios';
import { heroReducer, heroView, initialHeroState, startHeroClock } from '../src/components/hero/useHeroScenario';

vi.stubGlobal('React', React);
afterEach(() => vi.useRealTimers());

for (const scenario of Object.keys(SX_SCEN) as HeroScenarioId[]) {
  describe(`${scenario} script`, () => {
    it('progresses through tools, writing, answer, and approval without auto-approving', () => {
      let state = heroReducer(initialHeroState, { type: 'play', scenario });
      const S = SX_SCEN[scenario];
      for (let i = 0; i < S.tools.length; i++) {
        const view = heroView(state, false);
        expect(view.curLabel).toBe(S.tools[i]);
        expect(view.tools).toHaveLength(i + 1);
        expect(view.tools.filter(t => t.run).map(t => t.label)).toEqual([S.tools[i]]);
        expect(view.answered).toBe(false);
        expect(view.compText).toBe('Add something to the current answer');
        state = heroReducer(state, { type: 'tick' });
      }
      expect(heroView(state, false).curLabel).toBe('Writing the answer');
      expect(heroView(state, false).tools.every(t => !t.run)).toBe(true);
      state = heroReducer(state, { type: 'tick' });
      expect(heroView(state, false).answered).toBe(true);
      expect(heroView(state, false).showApproval).toBe(false);
      state = heroReducer(state, { type: 'tick' });
      expect(heroView(state, false).showApproval).toBe(true);
      expect(heroView(state, false).busy).toBe(true);
      expect(heroReducer(state, { type: 'tick' })).toBe(state);
      const approved = heroReducer(state, { type: 'approve', reduced: false });
      expect(heroView(approved, false)).toMatchObject({ doneLine: S.doneLine, doneText: S.done, showApproval: false, busy: false, compText: 'Message Rafic' });
      const denied = heroReducer(state, { type: 'deny', reduced: false });
      expect(heroView(denied, false)).toMatchObject({ doneLine: 'Denied · nothing was sent', doneText: 'Understood. The drafts stay in your mailbox if you change your mind.', showApproval: false, busy: false });
      const replay = heroReducer(approved, { type: 'play', scenario });
      expect(replay).toMatchObject({ scenario, step: 0, outcome: null });
      expect(replay.run).toBeGreaterThan(approved.run);
    });
    it('shows the finished meaningful state under reduced motion and supports decisions and replay', () => {
      const state = heroReducer(initialHeroState, { type: 'play', scenario });
      expect(heroView(state, true)).toMatchObject({ answered: true, tracing: false, showApproval: true });
      for (const type of ['approve', 'deny'] as const) {
        const decided = heroReducer(state, { type, reduced: true });
        expect(decided.outcome).toBe(type);
        expect(heroView(decided, true).busy).toBe(false);
        expect(heroView(heroReducer(decided, { type: 'play', scenario }), true).showApproval).toBe(true);
      }
    });
  });
}

it('only advances each second while the region is active; cleanup preserves the current step', () => {
  vi.useFakeTimers();
  let state = initialHeroState;
  const tick = vi.fn(() => { state = heroReducer(state, { type: 'tick' }); });
  startHeroClock(false, tick)();
  vi.advanceTimersByTime(10000);
  expect(tick).not.toHaveBeenCalled();
  const pause = startHeroClock(true, tick);
  vi.advanceTimersByTime(999);
  expect(state.step).toBe(0);
  vi.advanceTimersByTime(1001);
  expect(state.step).toBe(2);
  pause();
  vi.advanceTimersByTime(10000);
  expect(state.step).toBe(2);
  const stop = startHeroClock(true, tick);
  vi.advanceTimersByTime(1000);
  expect(state.step).toBe(3);
  stop();
  expect(vi.getTimerCount()).toBe(0);
});

it('rejects premature decisions and resets a switched scenario and any previous outcome', () => {
  expect(heroReducer(initialHeroState, { type: 'approve', reduced: false })).toBe(initialHeroState);
  const approved = heroReducer(initialHeroState, { type: 'approve', reduced: true });
  expect(heroReducer(approved, { type: 'deny', reduced: true })).toBe(approved);
  expect(heroReducer(approved, { type: 'play', scenario: 'monday' })).toMatchObject({ scenario: 'monday', step: 0, outcome: null });
});

it('renders exact copy, semantic table headers, keyboard buttons and a reduced-motion SSR state', () => {
  const markup = renderToStaticMarkup(React.createElement(Hero));
  expect(markup).toContain('href="#book"');
  expect(markup).toContain('href="#what"');
  expect(markup).toContain('<span class="nowrap">matters<span class="dot">.</span></span>');
  expect(markup).toContain('aria-label="The Rafic app at work"');
  expect(markup).toContain('aria-pressed="true"');
  expect(markup.match(/aria-pressed="false"/g)).toHaveLength(2);
  expect(markup).toContain('Thought for 3s');
  expect(markup).toContain('<strong>6 invoices</strong>');
  expect(markup.match(/scope="col"/g)).toHaveLength(4);
  expect(markup.match(/<button type="button"/g)).toHaveLength(5);
  expect(markup).toContain('Deny</button>');
  expect(markup).toContain('Approve</button>');
  expect(markup).toContain('Rafic can make mistakes. Check anything important.');
});
