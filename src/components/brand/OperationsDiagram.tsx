"use client";

import { useEffect, useRef, useState } from "react";

interface OperationsDiagramProps {
  className?: string;
}

export default function OperationsDiagram({
  className = "",
}: OperationsDiagramProps) {
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
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const nodes = [
    { label: "CRM", x: 180, y: 30 },
    { label: "Sales", x: 280, y: 90 },
    { label: "Purchase", x: 280, y: 170 },
    { label: "Accounting", x: 180, y: 230 },
    { label: "Manufacturing", x: 80, y: 230 },
    { label: "Inventory", x: -20, y: 170 },
    { label: "Projects", x: -20, y: 90 },
  ];

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-[400px] mx-auto ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="-40 -10 360 280"
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        {/* Connection lines */}
        {nodes.map((node, i) => (
          <line
            key={`line-${i}`}
            x1="160"
            y1="130"
            x2={node.x}
            y2={node.y}
            stroke="var(--sutur-data-violet)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity={visible ? 0.5 : 0}
            style={{
              transition: `opacity 0.6s ease-out ${i * 0.1}s`,
            }}
          />
        ))}
        {/* Central core */}
        <circle
          cx="160"
          cy="130"
          r="28"
          fill="var(--sutur-deep-interface)"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.2s" }}
        />
        <text
          x="160"
          y="126"
          textAnchor="middle"
          fill="var(--surface, #fffdfb)"
          fontSize="10"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.3s" }}
        >
          Sutur
        </text>
        <text
          x="160"
          y="140"
          textAnchor="middle"
          fill="var(--surface, #fffdfb)"
          fontSize="7"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.3s" }}
        >
          ERP
        </text>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g
            key={`node-${i}`}
            opacity={visible ? 1 : 0}
            style={{
              transition: `opacity 0.4s ease-out ${0.5 + i * 0.1}s, transform 0.4s ease-out ${0.5 + i * 0.1}s`,
              transform: visible ? "scale(1)" : "scale(0.5)",
              transformOrigin: `${node.x}px ${node.y}px`,
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="18"
              fill="var(--surface, #fffdfb)"
              stroke="var(--sutur-soft-signal)"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill="var(--ink, #25152a)"
              fontSize="8"
              fontWeight="600"
              fontFamily="Arial, sans-serif"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
