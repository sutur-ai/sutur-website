"use client";

import { useEffect, useRef, useState } from "react";

interface ModuleMapProps {
  className?: string;
}

const MODULES = [
  { label: "CRM", category: "Sales", desc: "Customer relationships & pipeline" },
  { label: "Sales", category: "Sales", desc: "Quotes, orders & invoicing" },
  { label: "Purchase", category: "Operations", desc: "Procurement & vendor management" },
  { label: "Accounting", category: "Finance", desc: "Full double-entry ledger" },
  { label: "Manufacturing", category: "Operations", desc: "BOMs, routings & work orders" },
  { label: "Inventory", category: "Operations", desc: "Multi-warehouse stock tracking" },
  { label: "Custom Dev", category: "Tech", desc: "Tailored apps and integrations" },
];

const CATEGORIES = ["Sales", "Operations", "Finance", "Tech"] as const;
const CAT_COLORS: Record<string, string> = {
  Sales: "var(--sutur-active-orange)",
  Operations: "var(--sutur-data-violet)",
  Finance: "var(--sutur-deep-interface)",
  Tech: "var(--sutur-soft-signal)",
};

export default function ModuleMap({ className = "" }: ModuleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className}`} aria-hidden="true">
      <svg viewBox="0 0 500 320" className="w-full h-auto">
        {/* Core */}
        <circle
          cx="250"
          cy="160"
          r="40"
          fill="var(--sutur-deep-interface)"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.6s ease-out" }}
        />
        <text
          x="250"
          y="155"
          textAnchor="middle"
          fill="var(--surface, #fffdfb)"
          fontSize="12"
          fontWeight="800"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.6s ease-out 0.2s" }}
        >
          Sutur
        </text>
        <text
          x="250"
          y="172"
          textAnchor="middle"
          fill="var(--surface, #fffdfb)"
          fontSize="8"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.6s ease-out 0.2s" }}
        >
          Core
        </text>

        {/* Module rings */}
        {MODULES.map((mod, i) => {
          const angle = (i / MODULES.length) * 2 * Math.PI - Math.PI / 2;
          const radius = 110;
          const cx = 250 + radius * Math.cos(angle);
          const cy = 160 + radius * Math.sin(angle);
          return (
            <g
              key={mod.label}
              opacity={visible ? 1 : 0}
              style={{
                transition: `opacity 0.4s ease-out ${0.4 + i * 0.1}s`,
              }}
            >
              <line
                x1="250"
                y1="160"
                x2={cx}
                y2={cy}
                stroke={CAT_COLORS[mod.category] || "var(--sutur-data-violet)"}
                strokeWidth="1"
                strokeDasharray="3 2"
                opacity={0.4}
              />
              <circle
                cx={cx}
                cy={cy}
                r="22"
                fill="var(--surface, #fffdfb)"
                stroke={CAT_COLORS[mod.category] || "var(--sutur-data-violet)"}
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy - 2}
                textAnchor="middle"
                fill="var(--ink, #25152a)"
                fontSize="8"
                fontWeight="700"
                fontFamily="Arial, sans-serif"
              >
                {mod.label}
              </text>
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fill="var(--muted-ink)"
                fontSize="6"
                fontFamily="Arial, sans-serif"
              >
                {mod.category}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
