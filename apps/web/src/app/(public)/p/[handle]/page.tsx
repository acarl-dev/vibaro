import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { PublicArtistPageData } from "../components/shared";
import ModernTemplate from "../components/ModernTemplate";
import PageviewTracker from "../components/PageviewTracker";
import { backendFetch, getBackendBaseUrl } from "@/lib/api/backend";

type PublicPageApiData = Record<string, unknown>;

function normalizePublicPageData(data: PublicPageApiData): PublicArtistPageData {
  const raw = data as Record<string, unknown>;
  const videos = raw.videos ?? raw.videoItems ?? raw.video_items ?? undefined;
  const gallery_images = raw.gallery_images ?? raw.galleryImages ?? raw.gallery_items ?? undefined;
  const normalized = data as PublicArtistPageData;

  return {
    ...normalized,
    videos: videos as PublicArtistPageData["videos"],
    gallery_images: gallery_images as PublicArtistPageData["gallery_images"],
    images: {
      ...normalized.images,
      hero_image_url: normalized.images?.hero_image_url ?? "/images/preview/preview_defauld.jpg",
    },
  };
}

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

/**
 * Public fetch — served only when the page is published.
 * Cache-friendly: revalidate every 60s. A short delay after Publish is acceptable for MVP.
 * No auth header is sent, so the response is uniform and safe to cache.
 */
async function fetchPublicPage(handle: string): Promise<PublicArtistPageData | null> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/v1/p/${handle}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data as PublicPageApiData | null;
    if (!data) return null;
    return normalizePublicPageData(data);
  } catch {
    return null;
  }
}

/**
 * Owner preview fetch — bypasses is_published, requires auth + ownership.
 * Always fresh (no-store). Only called when the visitor has a vibaro_token cookie,
 * i.e. is a logged-in user viewing their own unpublished page in preview mode.
 */
async function fetchOwnerPreview(handle: string): Promise<PublicArtistPageData | null> {
  try {
    const res = await backendFetch(`/api/v1/p/${handle}/preview`, {
      cache: "no-store",
    });

    if (res.status === 403 || res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data as PublicPageApiData | null;
    if (!data) return null;
    return normalizePublicPageData(data);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("vibaro_token")?.value;
  const page = hasToken
    ? await fetchOwnerPreview(handle) ?? await fetchPublicPage(handle)
    : await fetchPublicPage(handle);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: `${page.display_name} | Vibaro`,
    description: page.bio ?? `${page.display_name} on Vibaro`,
  };
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------

export default async function PublicArtistPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("vibaro_token")?.value;

  // If the visitor has a session token, try the owner preview endpoint first.
  // This lets the owner see their own unpublished page.
  // Fall back to the public (published-only, cached) fetch if preview returns null
  // (e.g. the page belongs to another user).
  const page = hasToken
    ? await fetchOwnerPreview(handle) ?? await fetchPublicPage(handle)
    : await fetchPublicPage(handle);

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageviewTracker handle={handle} />
      <ModernTemplate page={page} />
    </>
  );
}
