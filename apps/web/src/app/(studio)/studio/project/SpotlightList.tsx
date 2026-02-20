"use client";

import { SpotlightData } from "@/lib/api/spotlights";
import SpotlightCard from "./SpotlightCard";

type SpotlightListProps = {
  spotlights: SpotlightData[];
  onUpdate: (spotlight: SpotlightData) => void;
  onRemove: (id: number) => void;
  onActivate: (id: number) => void;
};

export default function SpotlightList({
  spotlights,
  onUpdate,
  onRemove,
  onActivate,
}: SpotlightListProps) {
  return (
    <div className="space-y-3">
      {spotlights.map((spotlight) => (
        <SpotlightCard
          key={spotlight.id}
          spotlight={spotlight}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
}
