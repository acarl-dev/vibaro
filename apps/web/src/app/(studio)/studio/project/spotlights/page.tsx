import { backendFetch } from "@/lib/api/backend";
import ProjectClient from "../ProjectClient";
import { SpotlightData } from "@/lib/api/spotlights";

async function fetchSpotlights(): Promise<SpotlightData[]> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function SpotlightsPage() {
  const spotlights = await fetchSpotlights();
  return <ProjectClient spotlights={spotlights} />;
}
