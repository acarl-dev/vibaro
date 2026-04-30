"use client";

import { useState } from "react";

type PerformanceTrendBarProps = {
  data: { date: string; value: number }[];
  label: string;
};

export default function PerformanceTrendBar({ data, label }: PerformanceTrendBarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const total = values.reduce((s, v) => s + v, 0);
  const peakIdx = values.reduce((maxI, v, i) => (v > values[maxI] ? i : maxI), 0);

  // Single data point — show a simple stat instead
  if (data.length === 1) {
    return (
      <div
        className="flex items-center gap-4 py-4 px-2"
        style={{ color: "var(--studio-text-secondary)", fontSize: "13px" }}
      >
        <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--studio-text-primary)" }}>
          {values[0]}
        </span>
        <span>
          {label} am{" "}
          <span style={{ color: "var(--studio-text-primary)" }}>
            {new Date(data[0].date).toLocaleDateString("de-DE", { day: "2-digit", month: "long" })}
          </span>
          <br />
          <span style={{ fontSize: "11px" }}>Noch zu wenig Daten für einen Verlauf</span>
        </span>
      </div>
    );
  }

  // Show every N-th date label so they don't overlap
  const showEvery = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 4;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : null;

  return (
    <div className="space-y-0">
      {/* Summary row */}
      <div className="flex items-center justify-between mb-2 text-[11px]" style={{ color: "var(--studio-text-secondary)" }}>
        <span>
          Gesamt: <span style={{ color: "var(--studio-text-primary)", fontWeight: 600 }}>{total} {label}</span>
        </span>
        <span>
          Bester Tag: <span style={{ color: "var(--studio-accent)", fontWeight: 600 }}>
            {values[peakIdx]} {label} am {new Date(data[peakIdx].date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
          </span>
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-24 relative">
        {data.map((d, i) => {
          const isHovered = hoveredIdx === i;
          const isPeak = i === peakIdx;
          const heightPct = Math.max(6, (values[i] / max) * 100);
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute bottom-full mb-1.5 z-10 pointer-events-none"
                  style={{
                    background: "var(--studio-surface-elevated)",
                    border: "1px solid var(--studio-border)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                    color: "var(--studio-text-primary)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: isPeak ? "var(--studio-accent)" : "var(--studio-text-primary)" }}>
                    {values[i]}
                  </span>{" "}
                  {label}
                  <br />
                  <span style={{ color: "var(--studio-text-secondary)", fontSize: "10px" }}>
                    {new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              )}
              {/* Bar */}
              <div
                className="w-full transition-all"
                style={{
                  height: `${heightPct}%`,
                  background: isHovered
                    ? isPeak ? "var(--studio-accent)" : "rgba(255,255,255,0.25)"
                    : isPeak ? "var(--studio-accent)" : "rgba(255,255,255,0.1)",
                  borderRadius: "3px 3px 2px 2px",
                  opacity: activeIdx !== null && !isHovered ? 0.5 : 1,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Date axis */}
      <div className="flex items-start gap-1 mt-1">
        {data.map((d, i) => (
          <div key={d.date} className="flex-1 text-center" style={{ fontSize: "9px", color: "var(--studio-text-secondary)", opacity: i % showEvery === 0 ? 1 : 0 }}>
            {new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
          </div>
        ))}
      </div>
    </div>
  );
}