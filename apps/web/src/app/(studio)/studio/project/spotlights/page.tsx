import { redirect } from "next/navigation";

export default function SpotlightsPageRedirect() {
  // Legacy route: /studio/project/spotlights now redirects to canonical /studio/project.
  redirect("/studio/project");
}
