import { redirect } from "next/navigation";

export default function ErgebnissePageRedirect() {
  // Legacy route: keep for backwards compatibility, canonical analytics route is /studio/results.
  redirect("/studio/results");
}
