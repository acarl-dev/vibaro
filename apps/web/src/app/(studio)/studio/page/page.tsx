import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import PageOverviewClient from "./PageOverviewClient";
import type { SpotlightData as Spotlight } from "@/lib/api/spotlights";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  visible_sections?: string[];
};

async function fetchArtistPage(): Promise<ArtistPage | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data) return null;

    return {
      id: data.id,
      handle: data.handle,
      display_name: data.display_name,
      bio: data.bio ?? null,
      is_published: Boolean(data.is_published),
      avatar_url: data.avatar_url ?? null,
      hero_image_url: data.hero_image_url ?? null,
      visible_sections: data.visible_sections ?? ["profile", "links", "music", "shows", "releases", "videos", "gallery", "contact"],
    };
  } catch {
    return null;
  }
}

async function fetchActiveSpotlight(): Promise<Spotlight | null> {
  try {
    const res = await backendFetch("/api/v1/spotlights", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const spotlights = json?.data ?? [];
    const active = Array.isArray(spotlights)
      ? spotlights.find((s: { status: string }) => s.status === "active")
      : null;
    return active ?? null;
  } catch {
    return null;
  }
}

export default async function PageEditorPage() {
  const [page, activeSpotlight] = await Promise.all([
    fetchArtistPage(),
    fetchActiveSpotlight(),
  ]);

  if (!page) redirect("/studio/onboarding");

  return <PageOverviewClient page={page} activeSpotlight={activeSpotlight} />;
}
