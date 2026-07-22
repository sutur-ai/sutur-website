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
  it('keeps one focused section in place of the former homepage modules', () => {
    expect(page).toContain('<CompanyCapabilities />');
    expect(page).not.toContain('<ModuleGrid />');
    expect(page).not.toContain('<KnowledgeDiagram />');
    expect(page).not.toContain('<ProcessTimeline />');
  });

  it('presents all three offers as one semantic list', () => {
    expect(component).toContain('id="capabilities"');
    expect(component).toContain('aria-labelledby="capabilities-title"');
    expect(component).toContain('role="list"');
    expect(component).toContain("label: 'Odoo ERP implementation'");
    expect(component).toContain("label: 'Custom development'");
    expect(component).toContain("label: 'AI agent architecture'");
    expect(component.match(/visual: '(?:erp|custom|agent)'/g)).toHaveLength(3);
  });

  it('uses 20px flat cards and full-edge product windows', () => {
    expect(styles).toContain('border-radius: var(--radius-lg)');
    expect(styles).toMatch(/\.visual\s*{[^}]*height:\s*320px[^}]*background:\s*var\(--deep-interface\)/s);
    expect(styles).toMatch(/\.productWindow\s*{[^}]*inset:\s*0/s);
    expect(styles).not.toContain('backdrop-filter');
    expect(styles).not.toContain('gradient(');
  });

  it('uses only the SUTUR signal colors in the window chrome', () => {
    expect(component).toContain('function WindowChrome');
    expect(component).toContain('className={styles.windowControls}');
    expect(styles).toMatch(/\.windowControls i\s*{[^}]*background:\s*var\(--active-orange\)/s);
    expect(styles).toMatch(/\.windowControls i:nth-child\(2\)\s*{[^}]*background:\s*var\(--soft-signal\)/s);
    expect(styles).toMatch(/\.windowControls i:nth-child\(3\)\s*{[^}]*background:\s*var\(--data-violet\)/s);
  });

  it('renders the Odoo app launcher with its complete module set', () => {
    expect(component).toContain('className={styles.odooTopbar}');
    expect(component).toContain('className={styles.appLauncher}');
    for (const app of [
      'Discuss', 'Calendar', 'Appointments', 'Contacts', 'CRM', 'Sales',
      'Dashboards', 'Point of Sale', 'Accounting', 'Website', 'Purchase',
      'Inventory', 'Manufacturing', 'Settings',
    ]) {
      expect(component).toContain(`>${app}<`);
    }
  });

  it('keeps the product UI readable at desktop and wide-desktop sizes', () => {
    expect(styles).toMatch(/\.windowChrome\s*{[^}]*height:\s*36px/s);
    expect(styles).toMatch(/\.codeEditor\s*{[^}]*font:\s*7px\//s);
    expect(styles).toMatch(/\.chatMessage\s*{[^}]*font-size:\s*8px/s);
    expect(styles).toMatch(/@media \(min-width: 1500px\)[\s\S]*?\.appIcon\s*{[^}]*width:\s*46px/s);
  });

  it('stacks cards before product windows become compressed', () => {
    expect(styles).toMatch(/@media \(max-width: 1120px\)[\s\S]*\.capabilityGrid\s*{[^}]*grid-template-columns:\s*1fr/s);
    expect(styles).toMatch(/@media \(max-width: 680px\)[\s\S]*\.capability\s*{[^}]*grid-template-columns:\s*1fr/s);
  });

  it('renders a code editor with a file tree and visible diff states', () => {
    expect(component).toContain('className={styles.fileTree}');
    expect(component).toContain('purchase_order.py');
    expect(component).toContain('className={`${styles.codeLine} ${styles.removedLine}`}');
    expect(component).toContain('className={`${styles.codeLine} ${styles.addedLine}`}');
    expect(styles).toMatch(/\.removedLine\s*{[^}]*var\(--active-orange\)/s);
    expect(styles).toMatch(/\.addedLine\s*{[^}]*var\(--data-violet\)/s);
  });

  it('renders the business-agent chat with both user and agent states', () => {
    expect(component).toContain('className={styles.chatMessages}');
    expect(component).toContain('Create a purchase order from Supplier X');
    expect(component).toContain('Draft PO P00042 created');
    expect(component.match(/styles\.userMessage/g)).toHaveLength(2);
    expect(component.match(/styles\.agentMessage/g)).toHaveLength(2);
  });

  it('omits the obsolete full-width architecture figure', () => {
    expect(component).not.toContain('YOUR BUSINESS, CONNECTED END TO END');
    expect(component).not.toContain('className={styles.architecture}');
    expect(styles).not.toMatch(/\.architecture(?:[\s:{])/);
  });

  it('keeps navigation and calls to action pointed at live IDs', () => {
    expect(page).toContain('href="#capabilities"');
    expect(header).toContain("['What we build', 'capabilities']");
    expect(component).toContain('href="#book"');
  });
});
