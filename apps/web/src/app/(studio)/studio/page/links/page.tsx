import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import LinksClient from "../../links/LinksClient";

type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
};

type Link = {
  id: number;
  type?: string;
  title: string | null;
  url: string | null;
  position: number;
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
    };
  } catch {
    return null;
  }
}

async function fetchLinks(): Promise<Link[]> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me/links", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function PageLinksPage() {
  const page = await fetchArtistPage();
  if (!page) {
    redirect("/studio/onboarding");
  }

  const links = await fetchLinks();

  return <LinksClient initialLinks={links} />;
}
