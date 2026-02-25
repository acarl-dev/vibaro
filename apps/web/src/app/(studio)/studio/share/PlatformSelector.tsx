"use client";

import { useState } from "react";
import { PLATFORMS, type Platform } from "@/lib/platforms";

type PlatformSelectorProps = {
  onSelect: (platform: Platform) => void;
  selectedPlatformId?: string;
};

export default function PlatformSelector({ onSelect, selectedPlatformId }: PlatformSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--studio-text-secondary)" }}
      >
        1. Plattform wählen
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatformId === platform.id;
          const isHovered = hoveredId === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelect(platform)}
              onMouseEnter={() => setHoveredId(platform.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-col items-center gap-2 rounded-lg p-4 transition-all"
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
              <span className="text-2xl">{platform.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: isSelected ? "var(--studio-accent)" : "var(--studio-text-primary)" }}
              >
                {platform.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
