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
    for (const visualClass of ['erpVisual', 'customVisual', 'agentVisual']) {
      expect(styles).toContain(`.${visualClass}`);
    }
    expect(component.match(/role="listitem"/g)).toHaveLength(1);
  });

  it('uses each glass window as the full visual edge at a larger size', () => {
    expect(styles).toMatch(/\.visual\s*{[^}]*height:\s*320px/s);
    expect(styles).toMatch(/\.visual\s*{[^}]*backdrop-filter:\s*blur\(/s);
    expect(styles).toMatch(/\.productWindow\s*{[^}]*inset:\s*0/s);
    expect(styles).toMatch(/\.productWindow\s*{[^}]*border:\s*0/s);
    expect(styles).not.toContain('inset: 15px');
  });

  it('renders the Odoo home launcher in translucent macOS-style window chrome', () => {
    expect(component).toContain('function WindowChrome');
    expect(component).toContain('className={styles.windowControls}');
    expect(component).toContain('className={styles.odooTopbar}');
    expect(component).toContain('className={styles.appLauncher}');
    for (const app of [
      'Discuss',
      'Calendar',
      'Appointments',
      'Contacts',
      'CRM',
      'Sales',
      'Dashboards',
      'Point of Sale',
      'Accounting',
      'Website',
      'Purchase',
      'Inventory',
      'Manufacturing',
      'Settings',
    ]) {
      expect(component).toContain(`>${app}<`);
    }
  });

  it('stacks the capabilities before the product windows become compressed', () => {
    expect(styles).toContain('@media (max-width: 1050px) {\n  .capabilityGrid');
  });

  it('keeps code and chat information legible inside the enlarged windows', () => {
    expect(styles).toMatch(/\.windowChrome\s*{[^}]*height:\s*36px/s);
    expect(styles).toMatch(/\.codeEditor\s*{[^}]*font:\s*7px\//s);
    expect(styles).toMatch(/\.chatMessage\s*{[^}]*font-size:\s*8px/s);
  });

  it('scales product mockup detail up on wide desktop screens', () => {
    expect(styles).toMatch(/@media \(min-width: 1500px\)[\s\S]*?\.appIcon\s*{[^}]*width:\s*46px/s);
    expect(styles).toMatch(/@media \(min-width: 1500px\)[\s\S]*?\.codeEditor\s*{[^}]*font-size:\s*9px/s);
    expect(styles).toMatch(/@media \(min-width: 1500px\)[\s\S]*?\.chatMessage\s*{[^}]*font-size:\s*9\.5px/s);
  });

  it('renders a code editor with a file tree and visible diff lines', () => {
    expect(component).toContain('className={styles.fileTree}');
    expect(component).toContain('purchase_order.py');
    expect(component).toContain('inventory_sync.py');
    expect(component).toContain('className={`${styles.codeLine} ${styles.removedLine}`}');
    expect(component).toContain('className={`${styles.codeLine} ${styles.addedLine}`}');
    expect(component).toContain('resolve_supplier');
    expect(component).toContain('validate_quantity');
  });

  it('renders a business-agent chat with multiple prompts and compact replies', () => {
    expect(component).toContain('className={styles.chatMessages}');
    expect(component).toContain('Create a purchase order from Supplier X for 350 units of the Brown Winter Jacket.');
    expect(component).toContain('Draft PO P00042 created');
    expect(component).toContain('What else needs attention today?');
    expect(component).toContain('Two items are below safety stock.');
    expect(component.match(/styles\.userMessage/g)).toHaveLength(2);
    expect(component.match(/styles\.agentMessage/g)).toHaveLength(2);
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