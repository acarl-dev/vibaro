import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicArtistPageData } from "../components/shared";
import DarkEditorialTemplate from "../components/DarkEditorialTemplate";
import DarkMinimalTemplate from "../components/DarkMinimalTemplate";
import DarkStageTemplate from "../components/DarkStageTemplate";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// -----------------------------------------------------------------------------
// Data Fetching
// -----------------------------------------------------------------------------

async function fetchPublicPage(handle: string): Promise<PublicArtistPageData | null> {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/p/${handle}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
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
  const page = await fetchPublicPage(handle);

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
  const page = await fetchPublicPage(handle);

  if (!page) {
    notFound();
  }

  // Get theme key with fallback
  const themeKey = page.theme?.key || "dark-editorial";

  // Render appropriate template
  switch (themeKey) {
    case "dark-minimal":
      return <DarkMinimalTemplate page={page} />;
    case "dark-stage":
      return <DarkStageTemplate page={page} />;
    case "dark-editorial":
    default:
      return <DarkEditorialTemplate page={page} />;
  }
}
