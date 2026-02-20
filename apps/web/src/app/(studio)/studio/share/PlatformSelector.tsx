"use client";

import { useState } from "react";
import { PLATFORMS, type Platform } from "@/lib/platforms";

type PlatformSelectorProps = {
  onSelect: (platform: Platform) => void;
  selectedPlatformId?: string;
};

export default function PlatformSelector({ onSelect, selectedPlatformId }: PlatformSelectorProps) {
  return (
    <div>
      <h2 className="text-sm font-medium text-zinc-400 mb-3">1. Plattform wählen</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatformId === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelect(platform)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <span className="text-2xl">{platform.icon}</span>
              <span className={`text-sm font-medium ${isSelected ? "text-blue-400" : "text-zinc-300"}`}>
                {platform.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
