"use client";

import { useState } from "react";
import type { Platform, Placement } from "@/lib/platforms";

type PlacementSelectorProps = {
  platform: Platform;
  onSelect: (placement: Placement) => void;
  selectedPlacementId?: string;
};

export default function PlacementSelector({ platform, onSelect, selectedPlacementId }: PlacementSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        2. Platzierung wählen
        <span className="ml-2 normal-case font-normal" style={{ color: "var(--studio-text-secondary)", opacity: 0.6 }}>
          – {platform.label}
        </span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {platform.placements.map((placement) => {
          const isSelected = selectedPlacementId === placement.id;
          const isHovered = hoveredId === placement.id;
          return (
            <button
              key={placement.id}
              onClick={() => onSelect(placement)}
              onMouseEnter={() => setHoveredId(placement.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="rounded-lg p-4 text-left transition-all"
              style={{
                background: isSelected
                  ? "var(--studio-accent-muted)"
                  : isHovered
                  ? "var(--studio-surface-elevated)"
                  : "var(--studio-surface)",
                border: isSelected
                  ? "1px solid var(--studio-accent)"
                  : "1px solid var(--studio-border)",
                outline: isSelected ? "1px solid var(--studio-accent)" : "none",
                outlineOffset: "1px",
              }}
            >
              <span
                className="block text-sm font-semibold mb-1"
                style={{ color: isSelected ? "var(--studio-accent)" : "var(--studio-text-primary)" }}
              >
                {placement.label}
              </span>
              <span className="block text-xs" style={{ color: "var(--studio-text-secondary)" }}>
                {placement.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
