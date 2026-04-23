/**
 * Type definitions for the Studio Home API.
 * Separated from studio.ts so client components can safely import these
 * without pulling in server-only dependencies.
 */

export type SpotlightSummary = {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: string;
  show_on_page: boolean;
  starts_at: string | null;
  ends_at: string | null;
  days_active: number;
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

export type CompletenessItem = {
  key: string;
  label: string;
  done: boolean;
};

export type PageStatusData = {
  handle: string | null;
  is_published: boolean;
  display_name?: string | null;
  completeness?: {
    basis: CompletenessItem[];
    praesenz: CompletenessItem[];
  } | null;
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
  spotlight: SpotlightSummary | null;
  previous_spotlight: PreviousSpotlightData | null;
  traffic_snapshot: TrafficSnapshotData;
  top_links: TopLinkData[];
  page: PageStatusData | null;
  stats: StatsData;
  tip: TipData | null;
};
