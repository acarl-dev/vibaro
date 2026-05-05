import { redirect } from "next/navigation";

export default function SpotlightsPageRedirect() {
  // Legacy route: /studio/project/spotlights now redirects to canonical /studio/share/phases.
  redirect("/studio/share/phases");
}
