import { backendFetch } from "@/lib/api/backend";

export type ShareOverviewSpotlight = {
  id: number;
  title: string;
  type: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
};

export type ShareOverviewAnalytics = {
  total_clicks: number;
  total_pageviews: number;
  unique_pageviews: number;
  conversion_rate: number | null;
  by_platform: { platform: string; clicks: number }[];
  trend: { date: string; clicks: number }[];
};

async function fetchActiveSpotlight(): Promise<ShareOverviewSpotlight | null> {
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

async function fetchScheduledCount(): Promise<number> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return 0;
    const json = await res.json();
    const all = json?.data ?? [];
    return all.filter((s: { status: string }) => s.status === "scheduled").length;
  } catch {
    return 0;
  }
}

async function fetchPhaseAnalytics(spotlightId: number): Promise<ShareOverviewAnalytics | null> {
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

export async function fetchShareOverviewServerData() {
  const [activeSpotlight, scheduledCount] = await Promise.all([
    fetchActiveSpotlight(),
    fetchScheduledCount(),
  ]);

  const analytics = activeSpotlight
    ? await fetchPhaseAnalytics(activeSpotlight.id)
    : null;

  return {
    activeSpotlight,
    scheduledCount,
    analytics,
  };
}
