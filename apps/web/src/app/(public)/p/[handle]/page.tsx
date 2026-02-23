import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { PublicArtistPageData } from "../components/shared";
import ModernTemplate from "../components/ModernTemplate";
import StageTemplate from "../components/StageTemplate";
import EditorialTemplate from "../components/EditorialTemplate";
import MinimalTemplate from "../components/MinimalTemplate";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PublicPageApiData = Record<string, unknown>;

function normalizePublicPageData(data: PublicPageApiData): PublicArtistPageData {
  const raw = data as Record<string, unknown>;
  const videos = raw.videos ?? raw.videoItems ?? raw.video_items ?? undefined;
  const gallery_images = raw.gallery_images ?? raw.galleryImages ?? raw.gallery_items ?? undefined;

  return {
    ...(data as PublicArtistPageData),
    videos: videos as PublicArtistPageData["videos"],
    gallery_images: gallery_images as PublicArtistPageData["gallery_images"],
  };
}

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function fetchPublicPage(handle: string, token?: string): Promise<PublicArtistPageData | null> {
  if (!API_BASE_URL) return null;

  try {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/p/${handle}`, {
      cache: "no-store",
      headers,
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
  const token = cookieStore.get("vibaro_token")?.value;
  const page = await fetchPublicPage(handle, token);

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
  const token = cookieStore.get("vibaro_token")?.value;
  const page = await fetchPublicPage(handle, token);

  if (!page) {
    notFound();
  }

  // Select template based on theme_key (default: modern)
  const themeKey = page.theme?.key || "modern";

  switch (themeKey) {
    case "minimal":
      return <MinimalTemplate page={page} />;
    case "stage":
      return <StageTemplate page={page} />;
    case "editorial":
      return <EditorialTemplate page={page} />;
    case "modern":
    default:
      return <ModernTemplate page={page} />;
  }
}
