import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const component = readFileSync(
  new URL("../src/components/brand/AgentOrbit.tsx", import.meta.url),
  "utf8",
);
const styles = readFileSync(
  new URL("../src/components/brand/AgentOrbit.module.css", import.meta.url),
  "utf8",
);

describe("agent orbit hero", () => {
  it("keeps the interactive agent orbit in the hero", () => {
    expect(page).toContain("import { AgentOrbit } from '@/components/brand/AgentOrbit'");
    expect(page).toContain("<AgentOrbit />");
    expect(page).not.toContain('className="hero-summary"');
  });

  it("includes all eight Odoo modules and sixteen looping scenarios", () => {
    expect(component.match(/image:\s*"\/brand\/odoo-modules\//g)).toHaveLength(8);
    expect(component.match(/prompt:\s*"/g)).toHaveLength(16);
    expect(component).toContain("scenarioIndexRef.current = (scenarioIndexRef.current + 1) % SCENARIOS.length");
  });

  it("uses constant-speed straight packet paths and sustained two-lane traffic", () => {
    expect(component).toContain("const PACKET_SPEED = 76");
    expect(component).toContain("`M ${startX} ${startY} L ${endX} ${endY}`");
    expect(component).toContain('emitPacket(from, to, LANE_OFFSET, "orange")');
    expect(component).toContain('emitPacket(to, from, LANE_OFFSET, "purple")');
  });

  it("uses the supplied SUTUR icon as the central agent anchor", () => {
    expect(component).toContain('/brand/design-system/sutur-icon-soft.png');
    expect(component).toContain('className={styles.agentMark}');
    expect(component).not.toContain('className={styles.ghost}');
    expect(styles).toMatch(/\.agentMark\s*{[^}]*object-fit:\s*contain/s);
    expect(styles).toMatch(/\.working\s*{[^}]*border-color:\s*var\(--active-orange\)/s);
  });

  it("exposes focus, processing, label, and completion states", () => {
    expect(component).toContain("setWorking(true)");
    expect(component).toContain("setWorking(false)");
    expect(styles).toContain(".hasFocus .node:not(.engaged)");
    expect(styles).toContain(".node.processing .nodeFace");
    expect(styles).toContain(".node.processing .label");
    expect(styles).toContain(".badgeDone");
  });

  it("ends packet traffic when the countdown reaches its final number", () => {
    const instruction = component.indexOf("await emitPacket(scenario.route[0], scenario.route[1])");
    const countdown = component.indexOf("const badgeCountdown = countBadge(");
    const traffic = component.indexOf("sustainTwoLaneTraffic(scenario.route, workDuration)", countdown);
    const completion = component.indexOf('await emitPacket(completingModule, "Agent")');
    expect(instruction).toBeGreaterThan(-1);
    expect(countdown).toBeGreaterThan(instruction);
    expect(traffic).toBeGreaterThan(countdown);
    expect(completion).toBeGreaterThan(traffic);
  });

  it("reserves a balanced prompt zone above the orbit", () => {
    expect(styles).toMatch(/\.prompt\s*{[\s\S]*top:\s*0/);
    expect(styles).toMatch(/\.prompt\s*{[\s\S]*width:\s*min\(88%,\s*37\.5rem\)/);
    expect(styles).toMatch(/\.prompt\s*{[\s\S]*text-wrap:\s*balance/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*1040px\)[\s\S]*\.prompt\s*{[^}]*top:\s*8px/);
  });

  it("uses brand colors, uniform rounded-square nodes, and no gradients", () => {
    expect(styles).not.toContain("gradient(");
    expect(styles).toContain("var(--soft-signal)");
    expect(styles).toContain("var(--active-orange)");
    expect(styles).toContain("var(--data-violet)");
    expect(styles).toMatch(/\.nodeFace\s*{[^}]*border-radius:\s*var\(--radius-md\)/s);
    expect(styles).not.toContain(".n1 .nodeFace");
    expect(styles).not.toContain(".n3 .nodeFace");
    expect(styles).not.toContain(".agent::after");
  });

  it("keeps decorative motion disabled for reduced-motion users", () => {
    expect(styles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(styles).toMatch(/\.field,[\s\S]*animation:\s*none !important/s);
  });
});
