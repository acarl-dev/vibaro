import "server-only";

import { backendFetch } from "@/lib/api/backend";
import { fetchStudioHome } from "@/lib/api/studio";

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

export type ShareDistributionSpotlight = {
  id: number;
  title: string;
  slug: string;
  primary_url?: string;
};

export type ShareQRServerData = {
  handle: string | null;
  phaseTitle: string | null;
  totalClicks: number;
  pageUrl: string | null;
  shouldRedirect: boolean;
};

export type SharePerformanceComparisonPhase = {
  id: number;
  title: string;
  visitors: number;
  clicks: number;
  qr_scans: number;
  conversion: number | null;
  top_platform: string | null;
};

export type SharePerformanceServerData = {
  totalClicks: number;
  uniquePageviews: number;
  conversionRate: number | null;
  byPlatform: { platform: string; clicks: number }[];
  trend: { date: string; clicks: number }[];
  pvTrend: { date: string; views: number }[];
  phaseTitle: string | null;
  comparison: {
    current: SharePerformanceComparisonPhase | null;
    previous: SharePerformanceComparisonPhase | null;
  };
};

type ShareDistributionSpotlightListItem = {
  id: number;
  title: string;
  slug: string;
  status: string;
  primary_url?: string | null;
};

async function fetchActiveSpotlight(): Promise<ShareOverviewSpotlight | null> {
  // TODO (P2+): belongs to Phase/Links/Analytics layer
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
  // TODO (P2+): belongs to Phase/Links/Analytics layer
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
  // TODO (P2+): belongs to Phase/Links/Analytics layer
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

async function fetchShareDistributionBestSpotlight(): Promise<ShareDistributionSpotlight | null> {
  // TODO (P2+): belongs to Phase/Links/Analytics layer
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const list = (json?.data ?? []) as ShareDistributionSpotlightListItem[];
    if (list.length === 0) return null;

    const priority = ["active", "scheduled"];
    let best: ShareDistributionSpotlightListItem | null = null;
    for (const status of priority) {
      best = list.find((s) => s.status === status) ?? null;
      if (best) break;
    }
    if (!best) best = list[0];

    return {
      id: best.id,
      title: best.title,
      slug: best.slug,
      primary_url: best.primary_url || undefined,
    };
  } catch {
    return null;
  }
}

export async function fetchShareDistributionServerData() {
  // Guard semantics must stay identical: active phase required for distribution route.
  const gateSpotlight = await fetchActiveSpotlight();
  if (!gateSpotlight?.id) {
    return {
      shouldRedirect: true,
      activeSpotlight: null,
    };
  }

  const activeSpotlight = await fetchShareDistributionBestSpotlight();

  return {
    shouldRedirect: false,
    activeSpotlight,
  };
}

export async function fetchShareQRServerData(): Promise<ShareQRServerData> {
  try {
    const [homeData, spotlightRes] = await Promise.all([
      fetchStudioHome(),
      backendFetch("/api/v1/spotlights/active", { cache: "no-store" }),
    ]);

    const handle = homeData?.page?.handle ?? null;
    let phaseTitle: string | null = null;
    let totalClicks = 0;

    if (spotlightRes.ok) {
      const json = await spotlightRes.json();
      phaseTitle = json?.data?.title ?? null;

      if (json?.data?.id) {
        try {
          const analyticsRes = await backendFetch(
            `/api/v1/analytics/overview?range=7d&spotlight_id=${json.data.id}`,
            { cache: "no-store" }
          );
          if (analyticsRes.ok) {
            const aJson = await analyticsRes.json();
            totalClicks = aJson?.data?.total_clicks ?? 0;
          }
        } catch {
          // keep existing behavior: ignore analytics sub-request failures
        }
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const pageUrl = handle ? `${appUrl}/p/${handle}` : null;

    return {
      handle,
      phaseTitle,
      totalClicks,
      pageUrl,
      shouldRedirect: !pageUrl,
    };
  } catch {
    return {
      handle: null,
      phaseTitle: null,
      totalClicks: 0,
      pageUrl: null,
      shouldRedirect: true,
    };
  }
}

export async function fetchSharePerformanceServerData(): Promise<SharePerformanceServerData | null> {
  try {
    const [spotlightRes, comparisonRes] = await Promise.all([
      backendFetch("/api/v1/spotlights/active", { cache: "no-store" }),
      backendFetch("/api/v1/analytics/comparison", { cache: "no-store" }),
    ]);

    if (!spotlightRes.ok) return null;
    const spotlightJson = await spotlightRes.json();
    const spotlight = spotlightJson?.data;
    if (!spotlight) return null;

    const analyticsRes = await backendFetch(
      `/api/v1/analytics/overview?range=7d&spotlight_id=${spotlight.id}`,
      { cache: "no-store" }
    );

    const comparisonJson = comparisonRes.ok ? await comparisonRes.json() : null;
    const cmp = comparisonJson?.data ?? { current: null, previous: null };

    if (!analyticsRes.ok) {
      return {
        totalClicks: 0,
        uniquePageviews: 0,
        conversionRate: null,
        byPlatform: [],
        trend: [],
        pvTrend: [],
        phaseTitle: spotlight.title,
        comparison: cmp,
      };
    }

    const analyticsJson = await analyticsRes.json();
    const d = analyticsJson?.data;

    return {
      totalClicks: d?.total_clicks ?? 0,
      uniquePageviews: d?.unique_pageviews ?? 0,
      conversionRate: d?.conversion_rate ?? null,
      byPlatform: d?.by_platform ?? [],
      trend: d?.trend ?? [],
      pvTrend: d?.pv_trend ?? [],
      phaseTitle: spotlight.title,
      comparison: cmp,
    };
  } catch {
    return null;
  }
}

export async function fetchSharePhasesServerData() {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}
