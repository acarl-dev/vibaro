import { redirect } from "next/navigation";
import { fetchSharePerformanceServerData } from "@/lib/api/studio-share.server";
import PerformanceClient, { ComparisonPhase } from "./PerformanceClient";

export default async function PerformancePage() {
  // Guard: requires active phase — redirect if no active spotlight
  const data = await fetchSharePerformanceServerData();
  if (!data) redirect("/studio/share");
  const d = data;

  return (
    <PerformanceClient
      totalClicks={d.totalClicks}
      totalPageviews={d.totalPageviews}
      uniquePageviews={d.uniquePageviews}
      conversionRate={d.conversionRate}
      byPlatform={d.byPlatform}
      trend={d.trend}
      pvTrend={d.pvTrend}
      phaseTitle={d.phaseTitle}
      comparison={d.comparison as { current: ComparisonPhase | null; previous: ComparisonPhase | null }}
    />
  );
}
