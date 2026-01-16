import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import OverviewClient from "./OverviewClient";

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
  title: string;
  url: string;
  position: number;
};

type ContentCounts = {
  releases: number;
  shows: number;
  videos: number;
  gallery: number;
  links: number;
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

async function fetchContentCounts(artistPageId: number): Promise<ContentCounts> {
  // Fetch all content counts in parallel
  const [releasesRes, showsRes, videosRes, galleryRes] = await Promise.all([
    backendFetch(`/api/v1/artist-pages/${artistPageId}/releases`, { cache: "no-store" }).catch(() => null),
    backendFetch(`/api/v1/artist-pages/${artistPageId}/shows`, { cache: "no-store" }).catch(() => null),
    backendFetch(`/api/v1/studio/videos`, { cache: "no-store" }).catch(() => null),
    backendFetch(`/api/v1/studio/gallery`, { cache: "no-store" }).catch(() => null),
  ]);

  const releases = releasesRes?.ok ? (await releasesRes.json())?.data ?? [] : [];
  const shows = showsRes?.ok ? (await showsRes.json())?.data ?? [] : [];
  const videos = videosRes?.ok ? (await videosRes.json())?.data ?? [] : [];
  const gallery = galleryRes?.ok ? (await galleryRes.json())?.data ?? [] : [];

  return {
    releases: Array.isArray(releases) ? releases.length : 0,
    shows: Array.isArray(shows) ? shows.length : 0,
    videos: Array.isArray(videos) ? videos.length : 0,
    gallery: Array.isArray(gallery) ? gallery.length : 0,
    links: 0, // Will be set separately
  };
}

export default async function StudioOverviewPage() {
  const page = await fetchArtistPage();

  if (!page) {
    redirect("/studio/onboarding");
  }

  const links = await fetchLinks();
  const contentCounts = await fetchContentCounts(page.id);
  contentCounts.links = links.length;

  return <OverviewClient initialPage={page} initialLinks={links} contentCounts={contentCounts} />;
}
