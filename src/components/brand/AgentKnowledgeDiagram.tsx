"use client";

import { useEffect, useRef, useState } from "react";

interface AgentKnowledgeDiagramProps {
  className?: string;
}

export default function AgentKnowledgeDiagram({
  className = "",
}: AgentKnowledgeDiagramProps) {
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
      <svg viewBox="0 0 400 240" className="w-full h-auto">
        {/* Knowledge sources (left) */}
        {[
          { y: 40, label: "Documents" },
          { y: 100, label: "ERP Data" },
          { y: 160, label: "Email" },
          { y: 200, label: "Manuals" },
        ].map((src, i) => (
          <g
            key={src.label}
            opacity={visible ? 1 : 0}
            style={{ transition: `opacity 0.4s ease-out ${0.2 + i * 0.1}s` }}
          >
            <rect
              x="20"
              y={src.y - 12}
              width="100"
              height="24"
              rx="4"
              fill="var(--sutur-soft-signal)"
              opacity={0.6}
            />
            <text
              x="70"
              y={src.y + 4}
              textAnchor="middle"
              fill="var(--sutur-deep-interface)"
              fontSize="10"
              fontWeight="600"
              fontFamily="Arial, sans-serif"
            >
              {src.label}
            </text>
          </g>
        ))}
        {/* Policy layer (center) */}
        <rect
          x="160"
          y="20"
          width="80"
          height="200"
          rx="6"
          fill="var(--sutur-data-violet)"
          opacity={visible ? 0.15 : 0}
          stroke="var(--sutur-data-violet)"
          strokeWidth="1.5"
          style={{ transition: "opacity 0.5s ease-out 0.6s" }}
        />
        <text
          x="200"
          y="110"
          textAnchor="middle"
          fill="var(--sutur-data-violet)"
          fontSize="10"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.7s" }}
        >
          Policy
        </text>
        <text
          x="200"
          y="126"
          textAnchor="middle"
          fill="var(--sutur-data-violet)"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.7s" }}
        >
          &amp;
        </text>
        <text
          x="200"
          y="140"
          textAnchor="middle"
          fill="var(--sutur-data-violet)"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.7s" }}
        >
          Permissions
        </text>
        {/* Output (right) */}
        <rect
          x="300"
          y="80"
          width="80"
          height="60"
          rx="8"
          fill="var(--sutur-active-orange)"
          opacity={visible ? 0.9 : 0}
          style={{ transition: "opacity 0.4s ease-out 0.8s" }}
        />
        <text
          x="340"
          y="106"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.4s ease-out 0.9s" }}
        >
          Answers
        </text>
        <text
          x="340"
          y="122"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontFamily="Arial, sans-serif"
          opacity={visible ? 1 : 0}
          style={{ transition: "opacity 0.4s ease-out 0.9s" }}
        >
          Authorized
        </text>
        {/* Arrows */}
        <line
          x1="120"
          y1="120"
          x2="160"
          y2="120"
          stroke="var(--sutur-muted-ink)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
          opacity={visible ? 0.5 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.5s" }}
        />
        <line
          x1="240"
          y1="120"
          x2="300"
          y2="110"
          stroke="var(--sutur-muted-ink)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
          opacity={visible ? 0.5 : 0}
          style={{ transition: "opacity 0.5s ease-out 0.5s" }}
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--muted-ink)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
