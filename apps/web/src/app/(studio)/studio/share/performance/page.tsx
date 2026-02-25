import { backendFetch } from "@/lib/api/backend";
import StudioEmptyState from "../../../components/StudioEmptyState";
import { TrendingUp } from "../../../components/StudioIcons";
import PerformanceClient, { ComparisonPhase } from "./PerformanceClient";

type PerformanceData = {
  totalClicks: number;
  totalPageviews: number;
  uniquePageviews: number;
  conversionRate: number | null;
  byPlatform: { platform: string; clicks: number }[];
  trend: { date: string; clicks: number }[];
  pvTrend: { date: string; views: number }[];
  phaseTitle: string | null;
  comparison: { current: ComparisonPhase | null; previous: ComparisonPhase | null };
};

async function fetchPerformanceData(): Promise<PerformanceData | null> {
  try {
    // Fetch active spotlight + comparison in parallel
    const [spotlightRes, comparisonRes] = await Promise.all([
      backendFetch("/api/v1/spotlights/active", { cache: "no-store" }),
      backendFetch("/api/v1/analytics/comparison", { cache: "no-store" }),
    ]);

    if (!spotlightRes.ok) return null;
    const spotlightJson = await spotlightRes.json();
    const spotlight = spotlightJson?.data;
    if (!spotlight) return null;

    // Fetch analytics filtered to this phase
    const analyticsRes = await backendFetch(
      `/api/v1/analytics/overview?range=7d&spotlight_id=${spotlight.id}`,
      { cache: "no-store" }
    );

    const comparisonJson = comparisonRes.ok ? await comparisonRes.json() : null;
    const cmp = comparisonJson?.data ?? { current: null, previous: null };

    if (!analyticsRes.ok) {
      return {
        totalClicks: 0, totalPageviews: 0, uniquePageviews: 0, conversionRate: null,
        byPlatform: [], trend: [], pvTrend: [], phaseTitle: spotlight.title,
        comparison: cmp,
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
      comparison:      cmp,
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
      comparison={data.comparison}
    />
  );
}
