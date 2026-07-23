import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
const component = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.tsx', import.meta.url),
  'utf8',
);
const header = readFileSync(
  new URL('../src/components/sections/Header.tsx', import.meta.url),
  'utf8',
);
const navigation = readFileSync(
  new URL('../src/components/sections/navigation.ts', import.meta.url),
  'utf8',
);
const styles = readFileSync(
  new URL('../src/components/sections/CompanyCapabilities.module.css', import.meta.url),
  'utf8',
);

const integrations = [
  ['Odoo ERP', 'odoo.svg'],
  ['Gmail', 'gmail.svg'],
  ['Notion', 'notion.svg'],
  ['Slack', 'slack.svg'],
  ['Discord', 'discord.svg'],
  ['Obsidian', 'obsidian.svg'],
  ['SAP', 'sap.svg'],
  ['AutoCAD', 'autocad.svg'],
  ['Salesforce', 'salesforce.svg'],
  ['Google Drive', 'google-drive.svg'],
  ['HubSpot', 'hubspot.svg'],
  ['Microsoft Teams', 'microsoft-teams.svg'],
] as const;

describe('company capabilities section', () => {
  it('keeps Alex’s focused three-offer section and its semantic structure', () => {
    expect(page).toContain('<CompanyCapabilities />');
    expect(page).not.toContain('<ModuleGrid />');
    expect(page).not.toContain('<KnowledgeDiagram />');
    expect(page).not.toContain('<ProcessTimeline />');
    expect(component).toContain('id="capabilities"');
    expect(component).toContain('aria-labelledby="capabilities-title"');
    expect(component).toContain('role="list"');
    expect(component).toContain('role="listitem"');
    expect(component.match(/visual: '(?:erp|custom|agent)'/g)).toHaveLength(3);
  });

  it('preserves Alex’s approved offer order: AI, Odoo, custom development', () => {
    const agentIndex = component.indexOf("label: 'AI agent architecture'");
    const erpIndex = component.indexOf("label: 'Odoo ERP implementation'");
    const customIndex = component.indexOf("label: 'Custom development'");

    expect(agentIndex).toBeGreaterThan(-1);
    expect(agentIndex).toBeLessThan(erpIndex);
    expect(erpIndex).toBeLessThan(customIndex);
    expect(component).toContain("number: '01',\n    label: 'AI agent architecture'");
    expect(component).toContain("number: '02',\n    label: 'Odoo ERP implementation'");
    expect(component).toContain("number: '03',\n    label: 'Custom development'");
  });

  it('keeps full-edge, flat product windows at the centralized visual size', () => {
    expect(styles).toMatch(
      /\.visual\s*{[^}]*height:\s*var\(--capability-visual-height\)[^}]*background:\s*var\(--deep-interface\)/s,
    );
    expect(styles).toMatch(/\.productWindow\s*{[^}]*inset:\s*0[^}]*border:\s*0/s);
    expect(styles).not.toContain('backdrop-filter');
    expect(styles).not.toContain('gradient(');
  });

  it('uses only Sutur signal colors in product-window chrome', () => {
    expect(component).toContain('function WindowChrome');
    expect(component).toContain('className={styles.windowControls}');
    expect(styles).toMatch(/\.windowControls i\s*{[^}]*background:\s*var\(--active-orange\)/s);
    expect(styles).toMatch(
      /\.windowControls i:nth-child\(2\)\s*{[^}]*background:\s*var\(--soft-signal\)/s,
    );
    expect(styles).toMatch(
      /\.windowControls i:nth-child\(3\)\s*{[^}]*background:\s*var\(--data-violet\)/s,
    );
  });

  it('keeps the complete Odoo launcher and readable custom-development diff', () => {
    for (const app of [
      'Discuss', 'Calendar', 'Appointments', 'Contacts', 'CRM', 'Sales',
      'Dashboards', 'Point of Sale', 'Accounting', 'Website', 'Purchase',
      'Inventory', 'Manufacturing', 'Settings',
    ]) {
      expect(component).toContain(`>${app}<`);
    }
    expect(component).toContain('className={styles.fileTree}');
    expect(component).toContain('purchase_order.py');
    expect(component).toContain('resolve_supplier');
    expect(component).toContain('validate_quantity');
    expect(component).toContain('className={`${styles.codeLine} ${styles.removedLine}`}');
    expect(component).toContain('className={`${styles.codeLine} ${styles.addedLine}`}');
  });

  it('preserves the chrome-free, edge-to-edge honeycomb and every downloaded brand asset', () => {
    expect(component).toContain('viewBox="0 0 382 241"');
    expect(component).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(component).toContain("{ y: 48, centers: [64, 149, 233, 318] }");
    expect(component).toContain("{ y: 128, centers: [22, 106, 191, 276, 360] }");
    expect(component).toContain("{ y: 208, centers: [64, 149, 233, 318] }");
    expect(component).toContain('className={styles.integrationGrid}');
    expect(component).toContain('<polygon');
    expect(component).toContain('<image');
    expect(styles).toMatch(/\.integrationGrid\s*{[^}]*width:\s*100%[^}]*height:\s*100%/s);
    expect(styles).toMatch(/\.integrationHex\s*{[^}]*vector-effect:\s*non-scaling-stroke/s);

    for (const [app, asset] of integrations) {
      expect(component).toContain(`label: '${app}'`);
      expect(component).toContain(`icon: '/brand/integrations/${asset}'`);
      expect(existsSync(new URL(`../public/brand/integrations/${asset}`, import.meta.url))).toBe(true);
    }

    const agentVisual = component.slice(
      component.indexOf('className={`${styles.visual} ${styles.agentVisual}`'),
      component.indexOf('export function CompanyCapabilities'),
    );
    expect(agentVisual).not.toContain('<WindowChrome');
    expect(agentVisual).not.toContain('styles.productWindow');
  });

  it('changes from three columns to split rows before product UIs compress, then stacks on mobile', () => {
    expect(styles).toMatch(/\.capabilityGrid\s*{[^}]*grid-template-columns:\s*repeat\(3,/s);
    expect(styles).toMatch(
      /@media \(max-width: 1120px\)[\s\S]*?\.capabilityGrid\s*{[^}]*grid-template-columns:\s*1fr/s,
    );
    expect(styles).toMatch(
      /@media \(max-width: 680px\)[\s\S]*?\.capability\s*{[^}]*grid-template-columns:\s*1fr/s,
    );
  });

  it('keeps capability and global navigation pointed at live destinations', () => {
    expect(page).toContain('href="#capabilities"');
    expect(navigation).toContain("['Capabilities', '#capabilities']");
    expect(header).toContain('sectionLinks.map');
    expect(component).toContain('href="#book"');
  });
});
