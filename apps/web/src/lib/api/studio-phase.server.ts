import "server-only";

import { backendFetch } from "@/lib/api/backend";
import type { SpotlightData as Spotlight } from "@/lib/api/spotlights";

// NOTE: This server-side helper intentionally uses backendFetch and /api/v1/spotlights.
// Do not merge with lib/api/spotlights.ts without aligning endpoint semantics and error handling.
export async function fetchActiveSpotlight(): Promise<Spotlight | null> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const spotlights = json?.data ?? [];
    const active = Array.isArray(spotlights)
      ? spotlights.find((s: { status: string }) => s.status === "active")
      : null;
    return active ?? null;
  } catch {
    return null;
  }
}
