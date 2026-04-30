import { redirect } from "next/navigation";

export default function StagePage() {
  // Legacy route: old stage naming now routes to the phase management entry.
  redirect("/studio/project");
}
