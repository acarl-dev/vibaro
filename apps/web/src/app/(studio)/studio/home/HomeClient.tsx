"use client";

import ProjectStatusCard from "./ProjectStatusCard";
import TopLinksCard from "./TopLinksCard";
import PageStatusCard from "./PageStatusCard";
import TipCard from "./TipCard";
import StudioPageHeader from "../../components/StudioPageHeader";
import StudioStatCard from "../../components/StudioStatCard";
import type { StudioHomeData } from "@/lib/api/studio";

type HomeClientProps = {
  data: StudioHomeData;
};

export default function HomeClient({ data }: HomeClientProps) {
  return (
    <div>
      <StudioPageHeader
        title="DASHBOARD"
        subtitle="Dein Performance-Zentrum – schnell und übersichtlich."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StudioStatCard
          value={data.stats.total_clicks_7d}
          label="Klicks (7 Tage)"
          trend={
            data.stats.trend !== 0
              ? {
                  value: `${data.stats.trend > 0 ? "+" : ""}${data.stats.trend}%`,
                  positive: data.stats.trend > 0,
                }
              : undefined
          }
        />
        <StudioStatCard
          value={data.top_links.length || "—"}
          label="Aktive Links"
        />
        <StudioStatCard
          value={data.spotlight ? (data.spotlight.status === "active" ? "AKTIV" : "GEPLANT") : "—"}
          label="Projekt-Status"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <ProjectStatusCard spotlight={data.spotlight} />
          <PageStatusCard page={data.page} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TopLinksCard links={data.top_links} stats={data.stats} />
          <TipCard tip={data.tip} />
        </div>
      </div>
    </div>
  );
}
