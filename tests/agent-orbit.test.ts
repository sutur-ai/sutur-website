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

  it("keeps decorative motion disabled for reduced-motion users", () => {
    expect(styles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
