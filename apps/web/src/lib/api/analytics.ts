/**
 * API client for Analytics
 * Server-side functions used in React Server Components
 * Client-side functions used in "use client" components (via proxy routes)
 */

export type AnalyticsRange = "7d" | "30d";

export type PlatformStats = {
  platform: string;
  clicks: number;
};

export type PlacementStats = {
  platform: string;
  placement: string;
  clicks: number;
};

export type ModuleStats = {
  module: string;
  clicks: number;
};

export type ReferrerStats = {
  referrer: string;
  clicks: number;
};

export type TrendDataPoint = {
  date: string;
  clicks: number;
};

export type AnalyticsData = {
  range: AnalyticsRange;
  spotlight_id: number | null;
  campaign_id: number | null;
  total_clicks: number;
  by_platform: PlatformStats[];
  by_placement: PlacementStats[];
  by_module: ModuleStats[];
  by_referrer: ReferrerStats[];
  trend: TrendDataPoint[];
};

export type AnalyticsParams = {
  range?: AnalyticsRange;
  spotlight_id?: number;
  campaign_id?: number;
};

// ============================================
// Client-side functions (via Next.js proxy)
// ============================================

export type AnalyticsBreakdown = {
  total_clicks: number;
  trend: number;
  period: string;
  by_platform: {
    platform: string;
    clicks: number;
    placements: {
      placement: string;
      clicks: number;
    }[];
  }[];
};

/**
 * Fetch analytics breakdown (client-side via proxy)
 */
export async function fetchAnalyticsBreakdown(
  spotlightId: number,
  period: string = "7d"
): Promise<AnalyticsBreakdown> {
  const params = new URLSearchParams({
    spotlight_id: spotlightId.toString(),
    period,
  });

  const res = await fetch(`/api/studio/analytics/breakdown?${params.toString()}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message || `Failed to fetch analytics breakdown: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
