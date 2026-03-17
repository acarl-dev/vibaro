import "server-only";
import { backendFetch } from "./backend";

// Re-export types so server-side callers can still import everything from "studio"
export type {
  SpotlightSummary,
  PhaseStatsData,
  PreviousSpotlightData,
  TrafficSnapshotData,
  TopLinkData,
  CompletenessItem,
  PageStatusData,
  StatsData,
  TipData,
  StudioHomeData,
} from "./studio.types";

import type { StudioHomeData } from "./studio.types";

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
