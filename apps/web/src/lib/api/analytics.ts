/**
 * Server-side API client for Analytics
 * Used in React Server Components
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

/**
 * Fetch analytics overview (server-side only)
 */
export async function fetchAnalytics(
  params: AnalyticsParams = {}
): Promise<AnalyticsData | null> {
  try {
    const { backendFetch } = await import("@/lib/api/backend");
    
    const searchParams = new URLSearchParams();
    if (params.range) searchParams.append("range", params.range);
    if (params.spotlight_id) searchParams.append("spotlight_id", params.spotlight_id.toString());
    if (params.campaign_id) searchParams.append("campaign_id", params.campaign_id.toString());

    const url = `/api/v1/analytics/overview${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    
    const res = await backendFetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to fetch analytics:", res.status);
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}
