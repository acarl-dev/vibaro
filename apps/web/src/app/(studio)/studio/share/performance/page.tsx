import { backendFetch } from "@/lib/api/backend";
import StudioEmptyState from "../../../components/StudioEmptyState";
import { TrendingUp } from "../../../components/StudioIcons";
import PerformanceClient from "./PerformanceClient";

async function fetchPerformanceData(): Promise<{
  totalClicks: number;
  totalPageviews: number;
  uniquePageviews: number;
  conversionRate: number | null;
  byPlatform: { platform: string; clicks: number }[];
  trend: { date: string; clicks: number }[];
  pvTrend: { date: string; views: number }[];
  phaseTitle: string | null;
} | null> {
  try {
    // Fetch active spotlight first
    const spotlightRes = await backendFetch("/api/v1/spotlights/active", { cache: "no-store" });
    if (!spotlightRes.ok) return null;
    const spotlightJson = await spotlightRes.json();
    const spotlight = spotlightJson?.data;
    if (!spotlight) return null;

    // Fetch analytics filtered to this phase
    const analyticsRes = await backendFetch(
      `/api/v1/analytics/overview?range=7d&spotlight_id=${spotlight.id}`,
      { cache: "no-store" }
    );
    if (!analyticsRes.ok) {
      return {
        totalClicks: 0, totalPageviews: 0, uniquePageviews: 0, conversionRate: null,
        byPlatform: [], trend: [], pvTrend: [], phaseTitle: spotlight.title,
      };
    }
    const analyticsJson = await analyticsRes.json();
    const d = analyticsJson?.data;

    return {
      totalClicks:     d?.total_clicks     ?? 0,
      totalPageviews:  d?.total_pageviews  ?? 0,
      uniquePageviews: d?.unique_pageviews ?? 0,
      conversionRate:  d?.conversion_rate  ?? null,
      byPlatform:      d?.by_platform      ?? [],
      trend:           d?.trend            ?? [],
      pvTrend:         d?.pv_trend         ?? [],
      phaseTitle:      spotlight.title,
    };
  } catch {
    return null;
  }
}

export default async function PerformancePage() {
  const data = await fetchPerformanceData();

  if (!data) {
    return (
      <div>
        <StudioEmptyState
          icon={TrendingUp}
          title="Keine aktive Phase"
          description="Starte eine Phase, um Performance-Daten zu sehen."
          action={
            <a href="/studio/share" className="studio-btn studio-btn-primary">
              Zur Phase-Übersicht
            </a>
          }
        />
      </div>
    );
  }

  return (
    <PerformanceClient
      totalClicks={data.totalClicks}
      totalPageviews={data.totalPageviews}
      uniquePageviews={data.uniquePageviews}
      conversionRate={data.conversionRate}
      byPlatform={data.byPlatform}
      trend={data.trend}
      pvTrend={data.pvTrend}
      phaseTitle={data.phaseTitle}
    />
  );
}
