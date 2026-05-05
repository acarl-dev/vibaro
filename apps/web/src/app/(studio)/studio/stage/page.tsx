import { redirect } from "next/navigation";

export default function StagePage() {
  // Legacy route: route to canonical phase overview.
  redirect("/studio/share/phases");
}
