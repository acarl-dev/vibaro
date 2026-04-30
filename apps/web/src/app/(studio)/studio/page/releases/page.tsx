import { redirect } from "next/navigation";
import { fetchArtistPageId, fetchArtistPageReleases } from "@/lib/api/studio-page.server";
import ReleasesClient from "../../releases/ReleasesClient";

export default async function PageReleasesPage() {
  const artistPageId = await fetchArtistPageId();
  if (!artistPageId) {
    redirect("/studio/onboarding");
  }

  const releases = await fetchArtistPageReleases(artistPageId);

  return <ReleasesClient initialReleases={releases} />;
}
