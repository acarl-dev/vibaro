import "server-only";
import { backendFetch } from "./backend";

export type SpotlightData = {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: string;
  show_on_page: boolean;
  starts_at: string | null;
  ends_at: string | null;
  cover_image_url: string | null;
  artist_name: string | null;
  platform_name: string | null;
  phase_stats?: PhaseStatsData;
};

export type PhaseStatsData = {
  visitors: number;
  clicks: number;
  qr_scans: number;
  conversion: number | null;
  top_platform: string | null;
};

export type PreviousSpotlightData = {
  id: number;
  title: string;
  phase_stats: PhaseStatsData;
};

export type TrafficSnapshotData = {
  visitors_7d: number;
  trend_pct: number | null;
  top_platform: string | null;
};

export type TopLinkData = {
  id: number;
  label: string;
  short_code: string;
  url: string;
  clicks: number;
  platform: string | null;
  placement: string | null;
};

export type PageStatusData = {
  handle: string | null;
  url: string | null;
  is_published: boolean;
  display_name?: string | null;
};

export type StatsData = {
  total_clicks_7d: number;
  trend: number;
};

export type TipData = {
  type: string;
  message: string;
  action: string;
};

export type StudioHomeData = {
  spotlight: SpotlightData | null;
  previous_spotlight: PreviousSpotlightData | null;
  traffic_snapshot: TrafficSnapshotData;
  top_links: TopLinkData[];
  page: PageStatusData | null;
  stats: StatsData;
  tip: TipData | null;
};

/**
 * Fetch Studio Home dashboard data
 */
export async function fetchStudioHome(): Promise<StudioHomeData | null> {
  try {
    const res = await backendFetch("/api/v1/studio/home", { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error("Failed to fetch studio home:", res.status);
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching studio home:", error);
    return null;
  }
}
