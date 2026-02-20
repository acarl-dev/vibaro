import { redirect } from "next/navigation";

export default function SharePage() {
  // Temporary redirect to existing tracking links page
  // TODO: Build dedicated Tracking Links UI (Phase 3)
  redirect("/studio/teilbare-links");
}
