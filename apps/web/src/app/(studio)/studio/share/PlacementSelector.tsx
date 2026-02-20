"use client";

import type { Platform, Placement } from "@/lib/platforms";

type PlacementSelectorProps = {
  platform: Platform;
  onSelect: (placement: Placement) => void;
  selectedPlacementId?: string;
};

export default function PlacementSelector({ platform, onSelect, selectedPlacementId }: PlacementSelectorProps) {
  return (
    <div>
      <h2 className="text-sm font-medium text-zinc-400 mb-3">
        2. Platzierung wählen <span className="text-zinc-600">– {platform.label}</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {platform.placements.map((placement) => {
          const isSelected = selectedPlacementId === placement.id;
          return (
            <button
              key={placement.id}
              onClick={() => onSelect(placement)}
              className={`rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <span className={`block text-sm font-medium mb-1 ${isSelected ? "text-blue-400" : "text-zinc-300"}`}>
                {placement.label}
              </span>
              <span className="block text-xs text-zinc-500">
                {placement.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
