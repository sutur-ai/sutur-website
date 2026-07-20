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
  it("replaces the static hero summary with the interactive agent orbit", () => {
    expect(page).toContain('import { AgentOrbit } from "@/components/brand/AgentOrbit"');
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
    expect(component).toContain("sustainTwoLaneTraffic");
  });

  it("exposes working, focus, label, badge, and smirk states", () => {
    expect(component).toContain("setWorking(true)");
    expect(component).toContain("setWorking(false)");
    expect(styles).toContain(".working .mouthIdle");
    expect(styles).toContain(".working .mouthSmirk");
    expect(styles).toContain(".hasFocus .node:not(.engaged)");
    expect(styles).toContain(".processing .label");
    expect(styles).toContain(".badgeDone");
  });

  it("counts down after one instruction packet, during traffic, then reports after green", () => {
    expect(component).toContain("const BADGE_DURATION_RATIO = 0.55");
    const instruction = component.indexOf("await emitPacket(scenario.route[0], scenario.route[1])");
    const countdown = component.indexOf("const badgeCountdown = countBadge(");
    const traffic = component.indexOf("sustainTwoLaneTraffic(scenario.route, workDuration)", countdown);
    const green = component.indexOf("setBadge({ module: scenario.badge.module, value: scenario.badge.to, done: true })");
    const completion = component.indexOf('await emitPacket(completingModule, "Agent")');
    expect(instruction).toBeGreaterThan(-1);
    expect(countdown).toBeGreaterThan(instruction);
    expect(traffic).toBeGreaterThan(countdown);
    expect(green).toBeGreaterThan(traffic);
    expect(completion).toBeGreaterThan(green);
  });

  it("makes the ghost a larger central anchor on desktop and mobile", () => {
    expect(styles).toMatch(/\.agent\s*{[\s\S]*width:\s*min\(18%,\s*112px\)/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*480px\)[\s\S]*\.agent\s*{[^}]*width:\s*20%/);
  });

  it("keeps decorative motion disabled for reduced-motion users", () => {
    expect(styles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
