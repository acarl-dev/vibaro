import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { PublicArtistPageData } from "../components/shared";
import ModernTemplate from "../components/ModernTemplate";
import DarkEditorialTemplate from "../components/DarkEditorialTemplate";
import DarkEditorialFullTemplate from "../components/DarkEditorialFullTemplate";
import DarkMinimalTemplate from "../components/DarkMinimalTemplate";
import DarkStageTemplate from "../components/DarkStageTemplate";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PublicPageApiData = Record<string, unknown>;

function normalizePublicPageData(data: PublicPageApiData): PublicArtistPageData {
  const raw = data as Record<string, unknown>;
  const booking_email = raw.booking_email ?? raw.bookingEmail ?? null;
  const management_email = raw.management_email ?? raw.managementEmail ?? null;
  const press_email = raw.press_email ?? raw.pressEmail ?? null;
  const whatsapp_number = raw.whatsapp_number ?? raw.whatsappNumber ?? null;
  const videos = raw.videos ?? raw.videoItems ?? raw.video_items ?? undefined;
  const gallery_images = raw.gallery_images ?? raw.galleryImages ?? raw.gallery_items ?? undefined;

  return {
    ...(data as PublicArtistPageData),
    booking_email: booking_email as PublicArtistPageData["booking_email"],
    management_email: management_email as PublicArtistPageData["management_email"],
    press_email: press_email as PublicArtistPageData["press_email"],
    whatsapp_number: whatsapp_number as PublicArtistPageData["whatsapp_number"],
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
    case "dark-minimal":
      return <DarkMinimalTemplate page={page} />;
    case "dark-stage":
      return <DarkStageTemplate page={page} />;
    case "dark-editorial-full":
      return <DarkEditorialFullTemplate page={page} />;
    case "dark-editorial":
      return <DarkEditorialTemplate page={page} />;
    case "modern":
    default:
      return <ModernTemplate page={page} />;
  }
}
