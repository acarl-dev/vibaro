import { redirect } from "next/navigation";

export default function ProjectPage() {
  // Temporary redirect to existing stage page
  // TODO: Build dedicated Spotlight management page (Phase 3)
  redirect("/studio/stage");
}
