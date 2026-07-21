import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync(
  new URL('../src/app/page.tsx', import.meta.url),
  'utf8',
);
const component = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.tsx', import.meta.url),
  'utf8',
);
const header = readFileSync(
  new URL('../src/components/sections/Header.tsx', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.module.css', import.meta.url),
  'utf8',
);

describe('company capabilities section', () => {
  it('replaces the three former homepage sections with one focused section', () => {
    expect(page).toContain('<CompanyCapabilities />');
    expect(page).not.toContain('<ModuleGrid />');
    expect(page).not.toContain('<KnowledgeDiagram />');
    expect(page).not.toContain('<ProcessTimeline />');
    expect(page).not.toContain('id="solutions"');
    expect(page).not.toContain('id="agents"');
    expect(page).not.toContain('id="process"');
  });

  it('presents the three company offers in a semantic list', () => {
    expect(component).toContain('id="capabilities"');
    expect(component).toContain('aria-labelledby="capabilities-title"');
    expect(component).toContain('role="list"');
    expect(component).toContain("label: 'Odoo ERP implementation'");
    expect(component).toContain("label: 'Custom development'");
    expect(component).toContain("label: 'AI agent architecture'");
    expect(component.match(/visual: '(?:erp|custom|agent)'/g)).toHaveLength(3);
    expect(component).toContain('<CapabilityVisual kind={capability.visual} />');
    expect(styles).toMatch(/\.capabilityGrid\s*{[^}]*grid-template-columns:\s*repeat\(3,/s);
    expect(component.match(/role="listitem"/g)).toHaveLength(1);
  });

  it('omits the full-width architecture figure', () => {
    expect(component).not.toContain('YOUR BUSINESS, CONNECTED END TO END');
    expect(component).not.toContain('className={styles.architecture}');
    expect(styles).not.toMatch(/\.architecture(?:[\s:{])/);
  });

  it('keeps navigation and calls to action pointed at live section IDs', () => {
    expect(page).toContain('href="#capabilities"');
    expect(header).toContain("['What we build', 'capabilities']");
    expect(component).toContain('href="#book"');
  });
});