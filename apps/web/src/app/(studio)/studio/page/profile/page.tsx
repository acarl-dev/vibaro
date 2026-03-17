import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import ProfileClient from "../../profile/ProfileClient";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  hero_focal_x: number;
  hero_focal_y: number;
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
      logo_url: data.logo_url ?? null,
      hero_focal_x: data.hero_focal_x ?? 50,
      hero_focal_y: data.hero_focal_y ?? 35,
    };
  } catch {
    return null;
  }
}

export default async function PageProfilePage() {
  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  return <ProfileClient initialPage={page} />;
}
