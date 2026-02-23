import { redirect } from "next/navigation";
import { fetchStudioHome } from "@/lib/api/studio";
import HomeClient from "./home/HomeClient";

export default async function StudioHomePage() {
  const data = await fetchStudioHome();

  if (!data) {
    // Auth or server error – layout already verified the artist page exists,
    // so a null here means a session/token problem, not missing onboarding.
    redirect("/login?next=/studio");
  }

  return <HomeClient data={data} />;
}
