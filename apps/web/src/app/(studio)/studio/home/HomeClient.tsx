"use client";

import type { StudioHomeData } from "@/lib/api/studio.types";
import WebsiteGrowthCard from "./cards/PageReadinessCard";
import { HeroActive, HeroEmpty } from "./cards/HeroCard";
import QuickActions from "./cards/QuickActions";
import TrafficSnapshot from "./cards/TrafficSnapshot";

type HomeClientProps = {
  data: StudioHomeData;
};

export default function HomeClient({ data }: HomeClientProps) {
  const isActive = data.spotlight?.status === "active";

  return (
    <div className="space-y-5">
      {/* 1. Primary Hero Card */}
      {isActive && data.spotlight ? (
        <HeroActive
          spotlight={data.spotlight}
          pagePublished={Boolean(data.page?.is_published)}
        />
      ) : (
        <HeroEmpty />
      )}

      {/* 2. Next Actions Strip */}
      <QuickActions hasActivePhase={isActive} pageHandle={data.page?.handle ?? null} />

      {/* 3. Website Growth Card */}
      {data.page?.completeness && (
        <WebsiteGrowthCard page={data.page} />
      )}

      {/* 4. Performance / Traffic – always shown, with empty state when no data */}
      <TrafficSnapshot
        snap={data.traffic_snapshot}
        stats={data.stats}
        page={data.page}
        hasActivePhase={isActive}
      />
    </div>
  );
}
