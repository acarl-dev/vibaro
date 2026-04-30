import { backendFetch } from "@/lib/api/backend";
import type { SpotlightData as Spotlight } from "@/lib/api/spotlights";

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
