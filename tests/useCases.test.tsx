import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { UseCases } from '../src/components/sections/UseCases';
import { SX_TEAMS } from '../src/content/useCases';

vi.stubGlobal('React', React);
it('offers all five teams and initially shows three Operations quotes with their app pills', () => {
  const markup = renderToStaticMarkup(<UseCases />);
  expect(markup).toContain('id="teams"');
  expect(markup).toContain('role="group" aria-label="Choose a team"');
  expect(markup.match(/aria-pressed="true"/g)).toHaveLength(1);
  expect(markup).toMatch(/aria-pressed="true"[^>]*>Operations<\/button>/);
  for (const team of Object.values(SX_TEAMS)) {
    expect(markup).toContain(`>${team.label}</button>`);
    expect(team.asks).toHaveLength(3);
    for (const ask of team.asks) expect(ask.apps).toHaveLength(2);
  }
  for (const ask of SX_TEAMS.ops.asks) {
    expect(markup).toContain(`“${ask.q}”`);
    for (const app of ask.apps) expect(markup).toContain(`>${app}</span>`);
  }
  expect(markup.match(/Rafic uses/g)).toHaveLength(3);
  expect(markup).toContain('id="team-asks"');
  expect(markup).toContain('aria-live="polite" aria-atomic="true"');
});
