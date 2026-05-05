import "server-only";

import { backendFetch } from "@/lib/api/backend";
import { fetchActiveSpotlight } from "@/lib/api/studio-phase.server";

export type ArtistPage = {
  id: number;
  handle: string;
  display_name: string;
  bio: string | null;
  is_published: boolean;
  avatar_url: string | null;
  hero_image_url: string | null;
  visible_sections?: string[];
};

export type ArtistPageProfile = {
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

export type ArtistPageLink = {
  id: number;
  type?: string;
  title: string | null;
  url: string | null;
  position: number;
};

export type FeaturedTrack = {
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

export type Show = {
  id: number;
  starts_at: string;
  venue: string;
  city: string;
  address: string | null;
  ticket_url: string | null;
  price: number | null;
  is_free: boolean;
  support_acts: string[] | null;
  flyer_path: string | null;
  status: string;
};

export type Release = {
  id: number;
  title: string;
  release_date: string;
  url: string | null;
  cover_path: string | null;
  is_featured: boolean;
};

export type Video = {
  id: number;
  title: string;
  platform: string;
  video_id: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  position: number;
  is_featured: boolean;
};

export type GalleryImage = {
  id: number;
  title: string | null;
  image_url: string;
  image_path: string;
  position: number;
};

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, T>);
  }
  return [];
}

async function fetchArtistPageData() {
  const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json();
  return json?.data ?? null;
}

export async function fetchArtistPage(): Promise<ArtistPage | null> {
  try {
    const data = await fetchArtistPageData();
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

export async function fetchArtistPageId(): Promise<number | null> {
  try {
    const data = await fetchArtistPageData();
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function fetchArtistPageProfile(): Promise<ArtistPageProfile | null> {
  try {
    const data = await fetchArtistPageData();
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

export async function fetchArtistPageLinks(): Promise<ArtistPageLink[]> {
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

export async function fetchArtistPageFeaturedTracks(artistPageId: number): Promise<FeaturedTrack[]> {
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

export async function fetchArtistPageShows(artistPageId: number): Promise<Show[]> {
  try {
    const res = await backendFetch(`/api/v1/artist-pages/${artistPageId}/shows`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchArtistPageReleases(artistPageId: number): Promise<Release[]> {
  try {
    const res = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/releases`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeArray<Release>(json?.data);
  } catch {
    return [];
  }
}

export async function fetchStudioVideos(): Promise<Video[]> {
  try {
    const res = await backendFetch("/api/v1/studio/videos", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchStudioGalleryImages(): Promise<GalleryImage[]> {
  try {
    const res = await backendFetch("/api/v1/studio/gallery", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}
// Composition: orchestrates Website and Phase server data for the studio page entry.
export async function fetchStudioPageServerData() {
  const [page, activeSpotlight] = await Promise.all([
    fetchArtistPage(),
    fetchActiveSpotlight(),
  ]);

  return {
    page,
    activeSpotlight,
  };
}
