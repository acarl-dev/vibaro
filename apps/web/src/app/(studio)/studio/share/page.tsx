import { backendFetch } from "@/lib/api/backend";
import PhaseOverviewClient, { type PhaseSpotlight, type PhaseAnalytics } from "./PhaseOverviewClient";

async function fetchActiveSpotlight(): Promise<PhaseSpotlight | null> {
  try {
    const res = await backendFetch("/api/v1/spotlights/active", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json?.data;
    if (!d) return null;
    return {
      id: d.id,
      title: d.title,
      type: d.type ?? "other",
      status: d.status ?? "active",
      starts_at: d.starts_at ?? d.activated_at ?? null,
      ends_at: d.ends_at ?? null,
    };
  } catch {
    return null;
  }
}

async function fetchPhasAnalytics(spotlightId: number): Promise<PhaseAnalytics | null> {
  try {
    const res = await backendFetch(
      `/api/v1/analytics/overview?range=7d&spotlight_id=${spotlightId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const d = json?.data;
    if (!d) return null;
    return {
      total_clicks: d.total_clicks ?? 0,
      total_pageviews: d.total_pageviews ?? 0,
      unique_pageviews: d.unique_pageviews ?? 0,
      conversion_rate: d.conversion_rate ?? null,
      by_platform: d.by_platform ?? [],
      trend: d.trend ?? [],
    };
  } catch {
    return null;
  }
}

export default async function PhasePage() {
  const activeSpotlight = await fetchActiveSpotlight();
  const analytics = activeSpotlight
    ? await fetchPhasAnalytics(activeSpotlight.id)
    : null;

  return <PhaseOverviewClient activeSpotlight={activeSpotlight} analytics={analytics} />;
}
