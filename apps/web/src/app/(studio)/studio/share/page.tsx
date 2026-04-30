import { fetchShareOverviewServerData } from "@/lib/api/studio-share.server";
import PhaseOverviewClient from "./PhaseOverviewClient";

export default async function PhasePage() {
  // Composition route: Phase + Analytics are orchestrated here via centralized server read.
  const { activeSpotlight, scheduledCount, analytics } = await fetchShareOverviewServerData();

  return <PhaseOverviewClient activeSpotlight={activeSpotlight} analytics={analytics} scheduledCount={scheduledCount} />;
}
