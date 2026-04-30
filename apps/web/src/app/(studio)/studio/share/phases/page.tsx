import { fetchSharePhasesServerData } from "@/lib/api/studio-share.server";
import ProjectClient from "../../project/ProjectClient";
import { SpotlightData } from "@/lib/api/spotlights";

export default async function AllPhasesPage() {
  const spotlights = (await fetchSharePhasesServerData()) as SpotlightData[];
  return <ProjectClient spotlights={spotlights} />;
}
