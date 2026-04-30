import { redirect } from "next/navigation";
import { fetchArtistPageProfile } from "@/lib/api/studio-page.server";
import ProfileClient from "../../profile/ProfileClient";

export default async function PageProfilePage() {
  const page = await fetchArtistPageProfile();

  if (!page) {
    redirect("/studio/onboarding");
  }

  return <ProfileClient initialPage={page} />;
}
