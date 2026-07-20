"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AgentOrbit.module.css";

type ModuleName = "CRM" | "Sales" | "Accounting" | "Inventory" | "Purchasing" | "Manufacturing" | "E-commerce" | "Custom";
type Endpoint = ModuleName | "Agent";
type Scenario = { prompt: string; badge: { module: ModuleName; from: number; to: number }; route: Endpoint[] };

const MODULES: { name: ModuleName; image: string; position: string }[] = [
  { name: "CRM", image: "/brand/odoo-modules/crm.png", position: "n1" },
  { name: "Sales", image: "/brand/odoo-modules/sales.png", position: "n2" },
  { name: "Accounting", image: "/brand/odoo-modules/accounting.png", position: "n3" },
  { name: "Inventory", image: "/brand/odoo-modules/inventory.png", position: "n4" },
  { name: "Purchasing", image: "/brand/odoo-modules/purchasing.png", position: "n5" },
  { name: "Manufacturing", image: "/brand/odoo-modules/manufacturing.png", position: "n6" },
  { name: "E-commerce", image: "/brand/odoo-modules/ecommerce.png", position: "n7" },
  { name: "Custom", image: "/brand/odoo-modules/custom-development.svg", position: "n8" },
];

const SCENARIOS: Scenario[] = [
  { prompt: "Pay my employees tomorrow.", badge: { module: "Accounting", from: 10, to: 1 }, route: ["Agent", "Accounting"] },
  { prompt: "Can we promise 40 units to Acme by Friday?", badge: { module: "Inventory", from: 40, to: 12 }, route: ["Agent", "Sales", "Inventory", "Sales"] },
  { prompt: "Draft follow-ups for every deal untouched this week.", badge: { module: "CRM", from: 8, to: 1 }, route: ["Agent", "CRM", "Sales"] },
  { prompt: "Reorder everything likely to stock out this month.", badge: { module: "Purchasing", from: 6, to: 1 }, route: ["Agent", "Inventory", "Purchasing"] },
  { prompt: "Which paid online orders are still waiting to ship?", badge: { module: "E-commerce", from: 14, to: 3 }, route: ["Agent", "E-commerce", "Accounting", "Inventory"] },
  { prompt: "Can we finish next week’s production plan with current stock?", badge: { module: "Manufacturing", from: 5, to: 1 }, route: ["Agent", "Manufacturing", "Inventory", "Purchasing", "Manufacturing"] },
  { prompt: "Show overdue invoices tied to active opportunities.", badge: { module: "Accounting", from: 9, to: 2 }, route: ["Agent", "Accounting", "CRM", "Sales"] },
  { prompt: "Turn today’s website orders into a picking list.", badge: { module: "E-commerce", from: 18, to: 1 }, route: ["Agent", "E-commerce", "Inventory"] },
  { prompt: "Create supplier quotes for everything below safety stock.", badge: { module: "Purchasing", from: 7, to: 1 }, route: ["Agent", "Inventory", "Purchasing"] },
  { prompt: "Which customers grew fastest this quarter?", badge: { module: "CRM", from: 12, to: 3 }, route: ["Agent", "Accounting", "Sales", "CRM"] },
  { prompt: "Schedule work orders for this week’s confirmed sales.", badge: { module: "Manufacturing", from: 11, to: 1 }, route: ["Agent", "Sales", "Manufacturing", "Inventory"] },
  { prompt: "Find products sold below our target margin.", badge: { module: "Sales", from: 15, to: 4 }, route: ["Agent", "Sales", "Accounting"] },
  { prompt: "Prioritize leads using their recent quote activity.", badge: { module: "CRM", from: 16, to: 5 }, route: ["Agent", "CRM", "Sales", "CRM"] },
  { prompt: "Prepare the month-end reconciliation exceptions.", badge: { module: "Accounting", from: 13, to: 2 }, route: ["Agent", "Accounting"] },
  { prompt: "Require approval for discounts above fifteen percent.", badge: { module: "Custom", from: 6, to: 1 }, route: ["Agent", "Custom", "Sales", "Custom"] },
  { prompt: "Notify account managers about overdue customer invoices.", badge: { module: "CRM", from: 10, to: 1 }, route: ["Agent", "Accounting", "CRM"] },
];

const PACKET_SPEED = 76;
const TRAFFIC_INTERVAL = 120;
const LANE_OFFSET = 1.15;
const BADGE_DURATION_RATIO = 0.55;
const sleep = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function AgentOrbit() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Partial<Record<ModuleName, HTMLDivElement>>>({});
  const scenarioIndexRef = useRef(0);
  const [prompt, setPrompt] = useState("");
  const [visible, setVisible] = useState<Set<ModuleName>>(new Set());
  const [engaged, setEngaged] = useState<Set<ModuleName>>(new Set());
  const [processing, setProcessing] = useState<Set<ModuleName>>(new Set());
  const [hasFocus, setHasFocus] = useState(false);
  const [working, setWorking] = useState(false);
  const [badge, setBadge] = useState<{ module: ModuleName; value: number; done: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const waits = async (milliseconds: number) => {
      await sleep(milliseconds);
      return !cancelled;
    };

    const currentPoint = (name: Endpoint): [number, number] => {
      if (name === "Agent") return [50, 50];
      const node = nodeRefs.current[name];
      const field = fieldRef.current;
      if (!node || !field) return [50, 50];
      return [(node.offsetLeft / field.clientWidth) * 100, (node.offsetTop / field.clientHeight) * 100];
    };

    const pathBetween = (from: Endpoint, to: Endpoint, laneOffset = 0) => {
      const [x1, y1] = currentPoint(from);
      const [x2, y2] = currentPoint(to);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.hypot(dx, dy) || 1;
      const sourceTrim = Math.min(from === "Agent" ? 7 : 10, distance * 0.32);
      const targetTrim = Math.min(to === "Agent" ? 7 : 10, distance * 0.32);
      const laneX = (-dy / distance) * laneOffset;
      const laneY = (dx / distance) * laneOffset;
      const startX = x1 + (dx / distance) * sourceTrim + laneX;
      const startY = y1 + (dy / distance) * sourceTrim + laneY;
      const endX = x2 - (dx / distance) * targetTrim + laneX;
      const endY = y2 - (dy / distance) * targetTrim + laneY;
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    };

    const emitPacket = (from: Endpoint, to: Endpoint, laneOffset = 0, color: "orange" | "purple" | "" = "") =>
      new Promise<void>((resolve) => {
        const layer = signalRef.current;
        if (!layer || cancelled) return resolve();
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const packet = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const dash = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const tail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const size = 0.68;
        path.setAttribute("d", pathBetween(from, to, laneOffset));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "none");
        packet.setAttribute("class", `${styles.packet} ${color ? styles[color] : from === "Agent" ? styles.purple : styles.orange}`);
        dash.setAttribute("x", String(-size * 1.8));
        dash.setAttribute("y", String(-size * 0.45));
        dash.setAttribute("width", String(size * 3.6));
        dash.setAttribute("height", String(size * 0.9));
        dash.setAttribute("rx", String(size * 0.45));
        tail.setAttribute("cx", String(-size * 2.7));
        tail.setAttribute("r", String(size * 0.34));
        tail.setAttribute("opacity", ".42");
        packet.append(dash, tail);
        layer.append(path, packet);
        const length = path.getTotalLength();
        const duration = (length / PACKET_SPEED) * 1000;
        const startedAt = performance.now();
        const move = (now: number) => {
          if (cancelled) {
            packet.remove();
            path.remove();
            return resolve();
          }
          const progress = Math.min((now - startedAt) / duration, 1);
          const point = path.getPointAtLength(length * progress);
          const nearby = path.getPointAtLength(length * Math.min(1, progress + 0.015));
          const angle = (Math.atan2(nearby.y - point.y, nearby.x - point.x) * 180) / Math.PI;
          packet.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
          if (progress < 1) requestAnimationFrame(move);
          else {
            packet.remove();
            path.remove();
            resolve();
          }
        };
        requestAnimationFrame(move);
      });

    const sustainTwoLaneTraffic = async (route: Endpoint[], duration: number) => {
      const allLinks = route.slice(0, -1).map((from, index) => [from, route[index + 1]] as [Endpoint, Endpoint]);
      const moduleLinks = allLinks.filter(([from, to]) => from !== "Agent" && to !== "Agent");
      const links = moduleLinks.length ? moduleLinks : allLinks;
      const longestJourney = Math.max(...links.map(([from, to]) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathBetween(from, to, LANE_OFFSET));
        return (path.getTotalLength() / PACKET_SPEED) * 1000;
      }));
      const pending: Promise<void>[] = [];
      const startedAt = performance.now();
      while (!cancelled && performance.now() - startedAt < duration - longestJourney) {
        for (const [from, to] of links) {
          pending.push(emitPacket(from, to, LANE_OFFSET, "orange"));
          pending.push(emitPacket(to, from, LANE_OFFSET, "purple"));
        }
        await waits(TRAFFIC_INTERVAL);
      }
      await Promise.all(pending);
    };

    const typePrompt = async (text: string) => {
      setPrompt("");
      for (const character of text) {
        if (cancelled) return;
        setPrompt((current) => current + character);
        await waits(38);
      }
    };
    const erasePrompt = async () => {
      while (!cancelled) {
        let empty = false;
        setPrompt((current) => {
          empty = current.length === 0;
          return current.slice(0, -1);
        });
        if (empty) return;
        await waits(20);
      }
    };
    const countBadge = async (scenario: Scenario, duration: number) => {
      const steps = Math.max(1, scenario.badge.from - scenario.badge.to);
      for (let value = scenario.badge.from - 1; value >= scenario.badge.to; value -= 1) {
        await waits(duration / steps);
        if (cancelled) return;
        setBadge({ module: scenario.badge.module, value, done: false });
      }
    };

    const runScenario = async (scenario: Scenario) => {
      await typePrompt(scenario.prompt);
      if (!(await waits(420))) return;
      const involved = [...new Set(scenario.route.filter((name): name is ModuleName => name !== "Agent"))];
      setEngaged(new Set(involved));
      setHasFocus(true);
      if (!(await waits(520))) return;
      setBadge({ module: scenario.badge.module, value: scenario.badge.from, done: false });
      setProcessing(new Set(involved));
      setWorking(true);
      const countSteps = Math.max(1, scenario.badge.from - scenario.badge.to);
      const workDuration = Math.max(2800, Math.min(5200, countSteps * 160));
      await emitPacket(scenario.route[0], scenario.route[1]);
      if (!(await waits(230))) return;
      const badgeCountdown = countBadge(
        scenario,
        workDuration * BADGE_DURATION_RATIO,
      );
      await Promise.all([badgeCountdown, sustainTwoLaneTraffic(scenario.route, workDuration)]);
      setBadge({ module: scenario.badge.module, value: scenario.badge.to, done: true });
      if (!(await waits(180))) return;
      const completingModule = scenario.route.at(-1);
      if (completingModule && completingModule !== "Agent") await emitPacket(completingModule, "Agent");
      setWorking(false);
      setProcessing(new Set());
      if (!(await waits(820))) return;
      await erasePrompt();
      setBadge(null);
      setHasFocus(false);
      setEngaged(new Set());
      await waits(1500);
    };

    const play = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setVisible(new Set(MODULES.map(({ name }) => name)));
        setPrompt(SCENARIOS[0].prompt);
        return;
      }
      for (const { name } of MODULES) {
        if (cancelled) return;
        setVisible((current) => new Set([...current, name]));
        await waits(90);
      }
      await waits(900);
      while (!cancelled) {
        await runScenario(SCENARIOS[scenarioIndexRef.current]);
        scenarioIndexRef.current = (scenarioIndexRef.current + 1) % SCENARIOS.length;
      }
    };
    play();
    return () => {
      cancelled = true;
      signalRef.current?.replaceChildren();
    };
  }, []);

  return (
    <aside className={styles.orbit} aria-label="Sutur AI agent working across Odoo modules">
      <p className={styles.prompt}>{prompt}</p>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={`${styles.agent} ${working ? styles.working : ""}`} aria-label="Sutur AI agent">
        <svg className={styles.ghost} viewBox="0 0 100 100" aria-hidden="true">
          <g fill="#EAD1E5">
            <path d="M26 76V40c0-14.8 8.2-23 22-23h4c13.8 0 22 8.2 22 23v36l-8-8.5-8 8.5-8-8.5-8 8.5-8-8.5-8 8.5Z" />
            <path d="M26 38H15c-4 0-7 2.3-7 6s3 6 7 6h21V38H26Z" />
            <path d="M74 42h11c4 0 7 2.3 7 6s-3 6-7 6H64V42h10Z" />
          </g>
          <g className={styles.eyes} fill="#F57E20">
            <rect x="39" y="39" width="7" height="7" rx="1" />
            <rect x="54" y="39" width="7" height="7" rx="1" />
          </g>
          <rect className={styles.mouthIdle} x="46" y="51" width="8" height="10" rx="2" fill="#906FB1" />
          <path className={styles.mouthSmirk} d="M43.5 54.5c3 4.8 9.8 5.2 14.2-1.8" fill="none" stroke="#906FB1" strokeWidth="3.2" strokeLinecap="square" />
        </svg>
      </div>
      <div ref={fieldRef} className={`${styles.field} ${hasFocus ? styles.hasFocus : ""}`}>
        <svg ref={signalRef} className={styles.signals} viewBox="0 0 100 100" aria-hidden="true" />
        {MODULES.map((module) => (
          <div
            key={module.name}
            ref={(node) => { if (node) nodeRefs.current[module.name] = node; }}
            className={`${styles.node} ${styles[module.position]} ${visible.has(module.name) ? styles.visible : ""} ${engaged.has(module.name) ? styles.engaged : ""} ${processing.has(module.name) ? styles.processing : ""}`}
            role="img"
            aria-label={module.name}
          >
            <span className={styles.nodeFace}>
              <img src={module.image} alt="" />
              <span className={styles.label}>{module.name}</span>
              {badge?.module === module.name && (
                <b className={`${styles.badge} ${badge.done ? styles.badgeDone : ""}`}>{badge.value}</b>
              )}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
