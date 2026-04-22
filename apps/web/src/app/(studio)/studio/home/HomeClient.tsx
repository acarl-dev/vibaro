"use client";

import type { StudioHomeData } from "@/lib/api/studio.types";
import PageReadinessCard from "./cards/PageReadinessCard";
import { HeroActive, HeroEmpty } from "./cards/HeroCard";
import ComparisonCard from "./cards/ComparisonCard";
import QuickActions from "./cards/QuickActions";
import TrafficSnapshot from "./cards/TrafficSnapshot";
import PageStatusCard from "./cards/PageStatusCard";

type HomeClientProps = {
  data: StudioHomeData;
};

export default function HomeClient({ data }: HomeClientProps) {
  const isActive = data.spotlight?.status === "active";
  const prevConversion = data.previous_spotlight?.phase_stats?.conversion ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {data.page?.completeness && (
        <div style={{ marginBottom: "20px" }}>
          <PageReadinessCard page={data.page} />
        </div>
      )}
      <div style={{ marginBottom: "32px" }}>
        {isActive && data.spotlight ? (
          <HeroActive spotlight={data.spotlight} prevConversion={prevConversion} />
        ) : (
          <HeroEmpty />
        )}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <ComparisonCard current={isActive ? data.spotlight : null} previous={data.previous_spotlight} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <QuickActions hasActivePhase={isActive} />
      </div>
      {data.traffic_snapshot && (
        <div style={{ marginBottom: "20px" }}>
          <TrafficSnapshot snap={data.traffic_snapshot} stats={data.stats} page={data.page} />
        </div>
      )}
      <PageStatusCard page={data.page} />
    </div>
  );
}
