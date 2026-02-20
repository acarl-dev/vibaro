import { fetchAnalytics } from "@/lib/api/analytics";
import { fetchSpotlights, SpotlightData } from "@/lib/api/spotlights";
import { backendFetch } from "@/lib/api/backend";
import ResultsClient from "./ResultsClient";

async function getSpotlights(): Promise<SpotlightData[]> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { range?: string; spotlight?: string };
}) {
  const range = (searchParams.range === "30d" ? "30d" : searchParams.range === "90d" ? "90d" : "7d") as "7d" | "30d" | "90d";
  const spotlightId = searchParams.spotlight
    ? parseInt(searchParams.spotlight)
    : undefined;

  const [analytics, spotlights] = await Promise.all([
    fetchAnalytics({ range: range as "7d" | "30d", spotlight_id: spotlightId }),
    getSpotlights(),
  ]);

  return (
    <ResultsClient
      analytics={analytics}
      spotlights={spotlights}
      initialRange={range}
      initialSpotlightId={spotlightId}
    />
  );
}
