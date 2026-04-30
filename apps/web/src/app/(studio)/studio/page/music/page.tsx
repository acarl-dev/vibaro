import { redirect } from "next/navigation";
import { fetchArtistPageFeaturedTracks, fetchArtistPageId } from "@/lib/api/studio-page.server";
import MusicClient from "../../music/MusicClient";

export default async function PageMusicPage() {
  const artistPageId = await fetchArtistPageId();
  if (!artistPageId) {
    redirect("/studio/onboarding");
  }

  const tracks = await fetchArtistPageFeaturedTracks(artistPageId);

  return <MusicClient initialTracks={tracks} />;
}
