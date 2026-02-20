import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import PageOverviewClient from "./PageOverviewClient";
import type { Spotlight } from "@/lib/api/stage";

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

type ContentCounts = {
  links: number;
  shows: number;
  releases: number;
  featured_tracks: number;
  videos: number;
  gallery: number;
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
    
    // Find active spotlight
    const activeSpotlight = Array.isArray(spotlights)
      ? spotlights.find((s: any) => s.status === "active")
      : null;

    return activeSpotlight || null;
  } catch {
    return null;
  }
}

async function fetchContentCounts(pageId: number): Promise<ContentCounts> {
  try {
    const [linksRes, showsRes, releasesRes, tracksRes, videosRes, galleryRes] =
      await Promise.all([
        backendFetch(`/api/v1/artist-pages/me/links`, { cache: "no-store" }),
        backendFetch(`/api/v1/artist-pages/${pageId}/shows`, { cache: "no-store" }),
        backendFetch(`/api/v1/artist-pages/${pageId}/releases`, { cache: "no-store" }),
        backendFetch(`/api/v1/artist-pages/${pageId}/featured-tracks`, {
          cache: "no-store",
        }),
        backendFetch(`/api/v1/studio/videos`, { cache: "no-store" }),
        backendFetch(`/api/v1/studio/gallery`, { cache: "no-store" }),
      ]);

    const links = linksRes.ok ? (await linksRes.json())?.data ?? [] : [];
    const shows = showsRes.ok ? (await showsRes.json())?.data ?? [] : [];
    const releases = releasesRes.ok ? (await releasesRes.json())?.data ?? [] : [];
    const tracks = tracksRes.ok ? (await tracksRes.json())?.data ?? [] : [];
    const videos = videosRes.ok ? (await videosRes.json())?.data ?? [] : [];
    const gallery = galleryRes.ok ? (await galleryRes.json())?.data ?? [] : [];

    return {
      links: Array.isArray(links) ? links.length : 0,
      shows: Array.isArray(shows) ? shows.length : 0,
      releases: Array.isArray(releases) ? releases.length : 0,
      featured_tracks: Array.isArray(tracks) ? tracks.length : 0,
      videos: Array.isArray(videos) ? videos.length : 0,
      gallery: Array.isArray(gallery) ? gallery.length : 0,
    };
  } catch {
    return {
      links: 0,
      shows: 0,
      releases: 0,
      featured_tracks: 0,
      videos: 0,
      gallery: 0,
    };
  }
}

export default async function PageEditorPage() {
  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  const [counts, activeSpotlight] = await Promise.all([
    fetchContentCounts(page.id),
    fetchActiveSpotlight(),
  ]);

  return <PageOverviewClient page={page} counts={counts} activeSpotlight={activeSpotlight} />;
}
