import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import MusicClient from "../../music/MusicClient";

type FeaturedTrack = {
  id: number;
  title: string;
  artist_name: string | null;
  platform:
    | "spotify"
    | "youtubemusic"
    | "soundcloud";
  platform_url: string;
  embed_id: string | null;
  position: number;
};

async function fetchArtistPageId(): Promise<number | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchFeaturedTracks(artistPageId: number): Promise<FeaturedTrack[]> {
  try {
    const res = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/featured-tracks`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function PageMusicPage() {
  const artistPageId = await fetchArtistPageId();
  if (!artistPageId) {
    redirect("/studio/onboarding");
  }

  const tracks = await fetchFeaturedTracks(artistPageId);

  return <MusicClient initialTracks={tracks} />;
}
