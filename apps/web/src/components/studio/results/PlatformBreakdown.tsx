"use client";

import { AnalyticsBreakdown } from "@/lib/api/analytics";
import { getPlatform, getPlacement } from "@/lib/platforms";

type Props = {
  data: AnalyticsBreakdown;
};

export default function PlatformBreakdown({ data }: Props) {
  const maxClicks = Math.max(...data.by_platform.map((p) => p.clicks), 1);

  return (
    <div className="space-y-4">
      {data.by_platform.map((platformData) => {
        const platform = getPlatform(platformData.platform);
        
        return (
          <div key={platformData.platform}>
            {/* Platform-Zeile */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{platform?.icon ?? "🔗"}</span>
              <span className="text-sm font-medium text-zinc-200 w-24">
                {platform?.label ?? platformData.platform}
              </span>
              <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-400 rounded-full transition-all"
                  style={{ width: `${(platformData.clicks / maxClicks) * 100}%` }}
                />
              </div>
              <span className="text-sm text-zinc-400 w-20 text-right">
                {platformData.clicks} Klicks
              </span>
            </div>

            {/* Placement-Zeilen (eingerückt) */}
            <div className="space-y-1 ml-10">
              {platformData.placements
                .sort((a, b) => b.clicks - a.clicks)
                .map((placementData) => {
                  const placement = getPlacement(platformData.platform, placementData.placement);
                  
                  return (
                    <div key={placementData.placement} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 w-24 truncate">
                        {placement?.label ?? placementData.placement}
                      </span>
                      <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-600 rounded-full transition-all"
                          style={{ width: `${(placementData.clicks / maxClicks) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-16 text-right">
                        {placementData.clicks}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
