/**
 * Server-side analytics functions (uses backend.ts / cookies / server-only)
 * Client-safe types and functions live in analytics.ts
 */
import "server-only";
import { backendFetch } from "./backend";
import type { AnalyticsData, AnalyticsParams } from "./analytics";

/**
 * Fetch analytics overview (server-side only)
 */
export async function fetchAnalytics(
  params: AnalyticsParams = {}
): Promise<AnalyticsData | null> {
  try {
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
