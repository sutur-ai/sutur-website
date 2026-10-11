'use client';
import { useEffect, useReducer } from 'react';
import { SX_SCEN, type HeroScenarioId } from '../../content/heroScenarios';

export type HeroState = { scenario: HeroScenarioId; run: number; step: number; outcome: 'approve' | 'deny' | null };
export type HeroAction = { type: 'play'; scenario: HeroScenarioId } | { type: 'tick' } | { type: 'approve' | 'deny'; reduced: boolean };
export const initialHeroState: HeroState = { scenario: 'finance', run: 0, step: 0, outcome: null };

export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  if (action.type === 'play') return { scenario: action.scenario, run: state.run + 1, step: 0, outcome: null };
  const end = SX_SCEN[state.scenario].tools.length + 2;
  if (action.type === 'tick') return state.step < end && !state.outcome ? { ...state, step: state.step + 1 } : state;
  if (!state.outcome && (action.reduced || state.step >= end)) return { ...state, step: end, outcome: action.type };
  return state;
}

export function heroView(state: HeroState, reduced: boolean) {
  const scenario = SX_SCEN[state.scenario];
  const count = scenario.tools.length;
  const step = reduced ? count + 2 : state.step;
  const answered = step > count;
  const showApproval = step >= count + 2 && !state.outcome;
  const busy = (step < count + 2 || showApproval) && !state.outcome;
  return {
    scenario, step, answered, showApproval, busy, tracing: !answered,
    curLabel: step < count ? scenario.tools[step] : 'Writing the answer',
    tools: scenario.tools.slice(0, Math.min(step + 1, count)).map((label, i) => ({ label, run: step < count && i === step })),
    doneLine: state.outcome === 'deny' ? 'Denied · nothing was sent' : scenario.doneLine,
    doneText: state.outcome === 'deny' ? 'Understood. The drafts stay in your mailbox if you change your mind.' : scenario.done,
    compText: busy ? 'Add something to the current answer' : 'Message Rafic',
  };
}

/** Cleanup pauses the clock at its current step and cancels stale scenario ticks. */
export function startHeroClock(active: boolean, tick: () => void) {
  if (!active) return () => {};
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}

export function useHeroScenario(inView: boolean, reduced: boolean) {
  const [state, dispatch] = useReducer(heroReducer, initialHeroState);
  const advancing = state.step < SX_SCEN[state.scenario].tools.length + 2 && !state.outcome;
  useEffect(() => startHeroClock(inView && !reduced && advancing, () => dispatch({ type: 'tick' })), [inView, reduced, advancing, state.scenario, state.run]);
  return { state, view: heroView(state, reduced), play: (scenario: HeroScenarioId) => dispatch({ type: 'play', scenario }), decide: (type: 'approve' | 'deny') => dispatch({ type, reduced }) };
}
