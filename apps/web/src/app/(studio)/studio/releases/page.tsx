import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import ReleasesClient from "./ReleasesClient";

type Release = {
  id: number;
  title: string;
  release_date: string;
  url: string | null;
  cover_path: string | null;
  is_featured: boolean;
};

async function fetchArtistPageId(): Promise<number | null> {
  try {
    const res = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

async function fetchReleases(artistPageId: number): Promise<Release[]> {
  try {
    const res = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/releases`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export default async function StudioReleasesPage() {
  const artistPageId = await fetchArtistPageId();
  if (!artistPageId) {
    redirect("/studio/onboarding");
  }

  const releases = await fetchReleases(artistPageId);

  return <ReleasesClient initialReleases={releases} />;
}
