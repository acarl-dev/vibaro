import { redirect } from "next/navigation";
import { fetchStudioHome } from "@/lib/api/studio";
import HomeClient from "./home/HomeClient";

export default async function StudioHomePage() {
  const data = await fetchStudioHome();

  if (!data) {
    // If no data, user might not have an artist page or auth issue
    redirect("/studio/onboarding");
  }

  return <HomeClient data={data} />;
}
